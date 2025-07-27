import { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseResponse } from "../utils/parseResponse";
import { parseProtectedEvent } from "../utils/parseProtectecEvent";
import { unathorized } from "../utils/http";
import { ListMealsController } from '../controllers/ListMealsController';

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const request = parseProtectedEvent(event);

    const response = await ListMealsController.handler(request);

    return parseResponse(response);
  } catch (error) {
    return parseResponse(
      unathorized({
        error: "Invalid access token.",
      })
    );
  }
}
