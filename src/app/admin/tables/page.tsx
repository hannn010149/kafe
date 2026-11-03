import React from "react";
import TableManagerClient from "@/components/admin/TableManagerClient";
import { getTables } from "@/lib/db";

export default async function AdminTablesPage() {
  const tables = await getTables();
  return <TableManagerClient initialTables={tables} />;
}

