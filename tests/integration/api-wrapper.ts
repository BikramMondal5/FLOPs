import { NextRequest, NextResponse } from "next/server";
import http from "http";

interface RouteHandlers {
  GET?: (req: NextRequest, context?: any) => Promise<NextResponse>;
  POST?: (req: NextRequest, context?: any) => Promise<NextResponse>;
  PATCH?: (req: NextRequest, context?: any) => Promise<NextResponse>;
  DELETE?: (req: NextRequest, context?: any) => Promise<NextResponse>;
  PUT?: (req: NextRequest, context?: any) => Promise<NextResponse>;
}

export function createRouteServer(
  handlers: RouteHandlers,
  getParams?: (reqUrl: string) => Record<string, string>
) {
  const requestListener: http.RequestListener = async (req, res) => {
    try {
      const method = req.method as keyof RouteHandlers;
      const handler = handlers[method];

      if (!handler) {
        res.statusCode = 405;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: false, message: `Method ${method} Not Allowed` }));
        return;
      }

      // Read Body for methods with payloads
      let body: Buffer | undefined;
      if ((method as string) !== "GET" && (method as string) !== "HEAD") {
        const chunks: any[] = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        body = Buffer.concat(chunks);
      }

      // Build absolute URL
      const host = req.headers.host || "localhost";
      const url = `http://${host}${req.url || ""}`;

      // Build Headers
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.append(key, value);
        }
      }

      // Build NextRequest
      const nextRequest = new NextRequest(url, {
        method,
        headers,
        body,
        duplex: body ? "half" : undefined,
      } as any);

      // Resolve Params if any (e.g. dynamic [id] segments)
      const params = getParams ? getParams(req.url || "") : {};
      const context = { params: Promise.resolve(params) };

      // Execute handler
      const nextResponse = await handler(nextRequest, context);

      // Send Response Headers
      res.statusCode = nextResponse.status;
      nextResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      // Send Response Body
      const responseBody = await nextResponse.text();
      res.end(responseBody);
    } catch (error) {
      console.error("API Wrapper internal error:", error);
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, message: "Internal Server Error" }));
    }
  };

  return http.createServer(requestListener);
}
