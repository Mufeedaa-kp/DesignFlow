import { Response } from "express";

const clients = new Map<string, Set<Response>>();

export const addSSEClient = (
  userId: string,
  res: Response
) => {
  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }

  clients.get(userId)!.add(res);

  console.log(`SSE client connected: ${userId}`);

  res.on("close", () => {
    removeSSEClient(userId, res);
  });
};

export const removeSSEClient = (
  userId: string,
  res: Response
) => {
  const userClients = clients.get(userId);

  if (!userClients) {
    return;
  }

  userClients.delete(res);

  if (userClients.size === 0) {
    clients.delete(userId);
  }

  console.log(`SSE client disconnected: ${userId}`);
};

export const sendSSEToUser = (
  userId: string,
  data: unknown
) => {
  const userClients = clients.get(userId);

  if (!userClients) {
    return;
  }

  const message = `data: ${JSON.stringify(data)}\n\n`;

  userClients.forEach((client) => {
    client.write(message);
  });
};