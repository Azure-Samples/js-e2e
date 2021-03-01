import httpTrigger from "./index";
import { Context } from "@azure/functions";

describe("Test for validateTweet Function", () => {
    let context: Context;
    
    beforeEach(() => {
        context = ({ log: jest.fn() } as unknown) as Context;
    });
    
    test('404 - Http trigger request missing required params', async () => {

        const request = {
            body: null
        };

        await httpTrigger(context, request);

        expect(JSON.stringify(context.res.status)).toEqual("404");
    });
    
    test('200 - Http trigger returns success object', async () => {

        const request = {
            body: { tweetText: "This is my tweet" },
            headers: {
                Accept: 'application/json'
            }
        };

        await httpTrigger(context, request);

        expect(JSON.stringify(context.res.headers["Content-Type"]).includes('application/json')).toEqual(true)
        expect(JSON.stringify(context.res.body)).toEqual(JSON.stringify({
            "textReturn": "16 / 280",
            "isValid": true
        }));
    });
});