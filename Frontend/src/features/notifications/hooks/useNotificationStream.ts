// import { useEffect } from "react";
// import toast from "react-hot-toast";

// interface NotificationData {
//   _id: string;
//   title: string;
//   message: string;
//   type: string;
//   project?: string;
//   isRead: boolean;
//   createdAt: string;
// }

// interface NotificationEvent {
//   type: "NOTIFICATION" | "CONNECTED";
//   notification?: NotificationData;
//   message?: string;
// }

// const useNotificationStream = (
//   onNotification?: (
//     notification: NotificationData
//   ) => void
// ) => {
//   useEffect(() => {
//     const token = localStorage.getItem(
//       "designflow_token"
//     );

//     if (!token) {
//       return;
//     }

//     const controller = new AbortController();

//     const connectSSE = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/notifications/stream",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               Accept: "text/event-stream",
//             },
//             signal: controller.signal,
//           }
//         );

//         if (!response.ok) {
//           throw new Error(
//             `SSE connection failed: ${response.status}`
//           );
//         }

//         if (!response.body) {
//           throw new Error(
//             "SSE response body is not available"
//           );
//         }

//         const reader =
//           response.body.getReader();

//         const decoder = new TextDecoder();

//         let buffer = "";

//         while (true) {
//           const { value, done } =
//             await reader.read();

//           if (done) {
//             break;
//           }

//           buffer += decoder.decode(value, {
//             stream: true,
//           });

//           const events = buffer.split("\n\n");

//           buffer = events.pop() || "";

//           for (const event of events) {
//             const dataLine = event
//               .split("\n")
//               .find((line) =>
//                 line.startsWith("data:")
//               );

//             if (!dataLine) {
//               continue;
//             }

//             const jsonData =
//               dataLine
//                 .replace(/^data:\s*/, "");

//             try {
//               const data: NotificationEvent =
//                 JSON.parse(jsonData);

//               if (
//                 data.type === "CONNECTED"
//               ) {
//                 console.log(
//                   "Notification SSE connected"
//                 );
//               }

//               if (
//                 data.type ===
//                   "NOTIFICATION" &&
//                 data.notification
//               ) {
//                 onNotification?.(
//                   data.notification
//                 );

//                 toast(
//                   `${data.notification.title}: ${data.notification.message}`
//                 );
//               }
//             } catch (error) {
//               console.error(
//                 "Failed to parse SSE event:",
//                 error
//               );
//             }
//           }
//         }
//       } catch (error) {
//         if (
//           error instanceof DOMException &&
//           error.name === "AbortError"
//         ) {
//           return;
//         }

//         console.error(
//           "Notification SSE error:",
//           error
//         );
//       }
//     };

//     connectSSE();

//     return () => {
//       controller.abort();
//     };
//   }, [onNotification]);
// };



// export default useNotificationStream;