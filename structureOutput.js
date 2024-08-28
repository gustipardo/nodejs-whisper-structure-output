import { config } from 'dotenv';
import z from 'zod';
import { zodResponseFormat } from "openai/helpers/zod";

config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const Step = z.object({
    explanation: z.string(),
    output: z.string(),
});

const MathReasoning = z.object({
    steps: z.array(Step),
    final_answer: z.string(),
});

export const generateMathSolution = async () => {
    const model = "gpt-4o-2024-08-06";
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const payload = {
        model: model,
        messages: [
            { role: "system", content: "You are a helpful math tutor. Guide the user through the solution step by step." },
            { role: "user", content: "how can I solve 8x + 7 = -23" }
        ],
        response_format: zodResponseFormat(MathReasoning, "math_reasoning"),
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const parsedResponse = await response.json();
        const data = JSON.parse(parsedResponse.choices[0].message.content);

        // Log the solution in a readable format
        console.log(`\nMathematical Solution:\n${JSON.stringify(data, null, 2)}\n`);
    } catch (error) {
        console.error(`\nError generating the mathematical solution:\n${error}\n`);
    }
};



/*
 const CallSchema = z.object({
    clientTriger: z.string(),
    isProblemSolved: z.boolean(),
    ifNotWhy: z.string(),
    agentName: z.string(),
    
    doesAgentfollowProtocol: z.boolean()
})
 */

const CallSchema = z.object({
    customerReason: z.string(),
    isProblemSolved: z.boolean(),
    agentName: z.string(),    
})


export const extractInforFromCall = async () => {
    const model = "gpt-4o-2024-08-06";
    const apiUrl = 'https://api.openai.com/v1/chat/completions';

    const call = "Agent: Good morning, thank you for calling [Santander Bank]. My name is [Mariana Lopez]. How can I assist you today? Customer: Hi, good morning. My name is [Carlos Perez]. I’d like to make a payment to an overseas account, but it seems I can’t complete the transaction. Could you help me with that? Agent: Of course, [Mr. Perez]. Let me check your account to see what's happening. One moment, please... (brief pause). It seems your account isn't enabled for international transactions. To proceed with the payment, we'll need to enable that option on your account. Would you like me to do that now? Customer: Yes, please. It’s quite urgent since I need to make this payment today. Agent: Understood, I’ll proceed with the activation. I just need to confirm a few security details before we continue. Could you please provide me with your identification number and confirm the address on your account? Customer: Sure, my identification number is [45267891], and my address is [1234 Libertador Ave, Buenos Aires]. Agent: Thank you for the information, [Mr. Perez]. I have everything I need. I’m now enabling your account for international transactions... (brief pause). Done, the activation was successful. You should now be able to make the payment without any issues. Is there anything else I can assist you with today? Customer: That’s all, thank you so much. I really needed to make this payment, and I’m glad it got resolved so quickly. Agent: I’m happy to hear that, [Mr. Perez]. If you have any other questions or need further assistance in the future, please don’t hesitate to contact us. Thank you for choosing our bank. Have a great day. Customer: Thank you, you too. Goodbye. Agent: Goodbye."

    const content = "You extraxt information from a call, the agent name, the reason for the call and if the problem is solved or not."

    const payload = {
        model: model,
        messages: [
            { role: "system", content: content },
            { role: "user", content: call }
        ],
        response_format: zodResponseFormat(CallSchema, "call_schema"),
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const parsedResponse = await response.json();
        const data = JSON.parse(parsedResponse.choices[0].message.content);

        // Log the solution in a readable format
        console.log(`\nResponse:\n${JSON.stringify(data, null, 2)}\n`);
    } catch (error) {
        console.error(`\nError generating the nResponse:\n${error}\n`);
    }
};
