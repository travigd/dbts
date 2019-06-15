import { IsExact, assert } from "conditional-type-checks";

import { IntColumn, StringColumn } from "@/columntypes";
import ColumnWrapper from "@/ColumnWrapper";
import Database, { TableWrapperMap } from "@/Database";
import Table from "@/Table";
import TableWrapper from "@/TableWrapper";

test("TableWrapperMap correctly maps tables", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn();
  }

  assert<IsExact<true, false>>(false);
  assert<
    IsExact<
      TableWrapperMap<{ users: User }>["users"],
      TableWrapper<"users", User>
    >
  >(true);
});

test("Database correctly maps column types", () => {
  class User extends Table {
    id = new IntColumn();
    name = new StringColumn();
  }

  const db = Database(null as any, { users: new User() });

  assert<IsExact<typeof db["users"], TableWrapper<"users", User>>>(true);
  assert<IsExact<typeof db["users"], TableWrapper<"kittens", User>>>(false);

  assert<IsExact<typeof db["users"]["name"], ColumnWrapper<"name", string>>>(
    true,
  );
  assert<IsExact<typeof db["users"]["name"], ColumnWrapper<"name", number>>>(
    false,
  );
});

test("Database has TableWrappers defined.", () => {
  class UserTable extends Table {
    id = new IntColumn();
    name = new StringColumn();
  }

  const db = Database(null as any, {
    users: new UserTable(),
  });

  assert<IsExact<typeof db.users.id, ColumnWrapper<"id", number>>>(true);
  assert<IsExact<typeof db.users.id, ColumnWrapper<"id", string>>>(false);

  assert<IsExact<typeof db.users.name, ColumnWrapper<"name", string>>>(true);
  assert<IsExact<typeof db.users.name, ColumnWrapper<"name", unknown>>>(false);
});
