import { APIGatewayProxyHandler, APIGatewayEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';
import 'source-map-support/register';

const https = require('https');

let send = (data, callback) => {
  let body = JSON.stringify(data);

  let req = https.request({
    hostname: 'api.line.me',
    port: 443,
    path: '/v2/bot/message/reply',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      'Authorization': 'Bearer ' + process.env.CHANNEL_ACCESS_TOKEN
    }
  });

  req.end(body, (err) => {
    err && console.log(err);
    callback(err);
  });
}

export const main: APIGatewayProxyHandler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  //console.log(event.body);
  let body = JSON.parse(event.body);
  console.log('text is ' + body.events[0].message.text);
  let result = body.events && body.events[0];
  if (result) {
    let content = body.events[0] || {};
    let message = {
      "replyToken": result.replyToken,
      "message": [
        {
          "type": "text",
          "text": content.message.text //chatメッセージをそのまま返す
        }
      ]
    };
    send(message, () => {
      callback();
    })
  } else {
    callback();
  }
}
