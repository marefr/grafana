package sqlstore

import (
	"context"
	"fmt"

	"cuelang.org/go/pkg/strings"
	"github.com/opentracing/opentracing-go"
	"github.com/opentracing/opentracing-go/ext"
	"xorm.io/xorm/contexts"
)

type databaseTracingHook struct {
}

func (h *databaseTracingHook) BeforeProcess(c *contexts.ContextHook) (context.Context, error) {
	op := "Query"
	lcSQL := strings.ToLower(c.SQL)
	if strings.HasPrefix(lcSQL, "begin transaction") {
		op = "Transaction begin"
	} else if strings.HasPrefix(lcSQL, "commit") {
		op = "Transaction commit"
	} else if strings.HasPrefix(lcSQL, "rollback") {
		op = "Transaction rollback"
	} else if strings.HasPrefix(lcSQL, "prepare") {
		op = "Prepared statement"
	} else if strings.HasPrefix(lcSQL, "select") {
		op = "Select"
	} else if strings.HasPrefix(lcSQL, "update") {
		op = "Update"
	} else if strings.HasPrefix(lcSQL, "delete") {
		op = "Delete"
	}

	span, ctx := opentracing.StartSpanFromContext(c.Ctx, fmt.Sprintf("DB %s", op))
	c.Ctx = ctx
	ext.DBStatement.Set(span, c.SQL)

	// if c.Args != nil {
	// 	span.SetTag("db.args", fmt.Sprintf("%v", c.Args))
	// }
	return c.Ctx, nil
}

func (h *databaseTracingHook) AfterProcess(c *contexts.ContextHook) error {
	span := opentracing.SpanFromContext(c.Ctx)
	if span != nil {
		defer span.Finish()
		if c.Result != nil {
			if rowsAffected, err := c.Result.RowsAffected(); err != nil {
				span.SetTag("db.rows_affected", rowsAffected)
			}
		}

		if c.Err != nil {
			ext.Error.Set(span, true)
		}
	}

	return nil
}
