package bus

import (
	"context"
	"errors"
	"fmt"
	"testing"
)

type testQuery struct {
	Id   int64
	Resp string
}

func TestDispatchCtxCanUseNormalHandlers(t *testing.T) {
	bus := New()

	handlerWithCtxCallCount := 0
	handlerCallCount := 0

	handlerWithCtx := func(ctx context.Context, query *testQuery) error {
		handlerWithCtxCallCount++
		return nil
	}

	handler := func(query *testQuery) error {
		handlerCallCount++
		return nil
	}

	preHandlerCallCount := 0
	preHandler := func(query *testQuery) error {
		preHandlerCallCount++
		return nil
	}

	preHandlerCtxCallCount := 0
	preHandlerCtx := func(ctx context.Context, query *testQuery) error {
		preHandlerCtxCallCount++
		return nil
	}

	postHandlerCallCount := 0
	postHandler := func(err error, query *testQuery) error {
		postHandlerCallCount++
		return err
	}

	postHandlerCtxCallCount := 0
	postHandlerCtx := func(ctx context.Context, err error, query *testQuery) error {
		postHandlerCtxCallCount++
		return err
	}

	bus.AddPreDispatchHook(preHandler)
	bus.AddPreDispatchHook(preHandlerCtx)
	err := bus.AddPostDispatchHook(postHandler)
	if err != nil {
		t.Errorf("expected error to be nil, but was %v", err)
	}
	err = bus.AddPostDispatchHook(postHandlerCtx)
	if err != nil {
		t.Errorf("expected error to be nil, but was %v", err)
	}

	err = bus.DispatchCtx(context.Background(), &testQuery{})
	if err != ErrHandlerNotFound {
		t.Errorf("expected bus to return HandlerNotFound is no handler is registered")
	}

	bus.AddHandler(handler)

	t.Run("when a normal handler is registered", func(t *testing.T) {
		bus.Dispatch(&testQuery{})

		if handlerCallCount != 1 {
			t.Errorf("Expected normal handler to be called 1 time. was called %d", handlerCallCount)
		}

		if preHandlerCallCount != 1 {
			t.Errorf("Expected pre handler to be called 1 time. was called %d", preHandlerCallCount)
		}

		if preHandlerCtxCallCount != 1 {
			t.Errorf("Expected pre handler ctx to be called 1 time. was called %d", preHandlerCtxCallCount)
		}

		if postHandlerCallCount != 1 {
			t.Errorf("Expected post handler to be called 1 time. was called %d", postHandlerCallCount)
		}

		if postHandlerCtxCallCount != 1 {
			t.Errorf("Expected post handler ctx to be called 1 time. was called %d", postHandlerCtxCallCount)
		}

		t.Run("when a ctx handler is registered", func(t *testing.T) {
			bus.AddHandlerCtx(handlerWithCtx)
			bus.Dispatch(&testQuery{})

			if handlerWithCtxCallCount != 1 {
				t.Errorf("Expected ctx handler to be called 1 time. was called %d", handlerWithCtxCallCount)
			}

			if preHandlerCallCount != 2 {
				t.Errorf("Expected pre handler to be called 2 times. was called %d", preHandlerCallCount)
			}

			if preHandlerCtxCallCount != 2 {
				t.Errorf("Expected pre handler ctx to be called 2 times. was called %d", preHandlerCtxCallCount)
			}

			if postHandlerCallCount != 2 {
				t.Errorf("Expected post handler to be called 2 times. was called %d", postHandlerCallCount)
			}

			if postHandlerCtxCallCount != 2 {
				t.Errorf("Expected post handler ctx to be called 2 times. was called %d", postHandlerCtxCallCount)
			}
		})
	})

}

func TestQueryHandlerReturnsError(t *testing.T) {
	bus := New()

	bus.AddHandler(func(query *testQuery) error {
		return errors.New("handler error")
	})

	err := bus.Dispatch(&testQuery{})

	if err == nil {
		t.Fatal("Send query failed " + err.Error())
	} else {
		t.Log("Handler error received ok")
	}
}

func TestQueryHandlerReturn(t *testing.T) {
	bus := New()

	bus.AddHandler(func(q *testQuery) error {
		q.Resp = "hello from handler"
		return nil
	})

	query := &testQuery{}
	err := bus.Dispatch(query)

	if err != nil {
		t.Fatal("Send query failed " + err.Error())
	} else if query.Resp != "hello from handler" {
		t.Fatal("Failed to get response from handler")
	}
}

func TestEventListeners(t *testing.T) {
	bus := New()
	count := 0

	bus.AddEventListener(func(query *testQuery) error {
		count += 1
		return nil
	})

	bus.AddEventListener(func(query *testQuery) error {
		count += 10
		return nil
	})

	err := bus.Publish(&testQuery{})

	if err != nil {
		t.Fatal("Publish event failed " + err.Error())
	} else if count != 11 {
		t.Fatal(fmt.Sprintf("Publish event failed, listeners called: %v, expected: %v", count, 11))
	}
}
