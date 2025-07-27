import { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseResponse } from "../utils/parseResponse";
import { MeController } from "../controllers/MeController";
import { parseProtectedEvent } from "../utils/parseProtectecEvent";
import { unathorized } from "../utils/http";

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event);

    const response = await MeController.handler(request);

    return parseResponse(response);
  } catch (error) {
    return parseResponse(
      unathorized({
        error: "Invalid access token.",
      })
    );
  }
}
