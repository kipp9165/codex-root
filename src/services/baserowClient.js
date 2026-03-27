import axios from "axios";
import { BASEROW_API_URL, BASEROW_API_TOKEN } from "../config/env.js";
import { logger } from "../utils/logger.js";

const client = axios.create({
  baseURL: BASEROW_API_URL,
  headers: {
    Authorization: `Token ${BASEROW_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const data = err.response?.data;
    logger.error("Baserow request failed", { status, data, url: err.config?.url });
    return Promise.reject(err);
  }
);

export async function listRows(tableId, filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const url = `/api/database/rows/table/${tableId}/?${params}`;
  const res = await client.get(url);
  return res.data;
}

export async function createRow(tableId, fields) {
  const res = await client.post(`/api/database/rows/table/${tableId}/`, fields);
  return res.data;
}

export async function updateRow(tableId, rowId, fields) {
  const res = await client.patch(`/api/database/rows/table/${tableId}/${rowId}/`, fields);
  return res.data;
}

export async function deleteRow(tableId, rowId) {
  await client.delete(`/api/database/rows/table/${tableId}/${rowId}/`);
}

export async function getRowById(tableId, rowId) {
  const res = await client.get(`/api/database/rows/table/${tableId}/${rowId}/`);
  return res.data;
}
