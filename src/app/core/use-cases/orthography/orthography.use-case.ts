import { OrthographyReponse } from "@interfaces/orthography.response";
import { environment } from "environments/environment";

export const orthographyUseCase = async (prompt: string) => {

    try {

        const resp = await fetch(`${environment.backendApi}/orthography-check`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt }),
        });

        if (!resp.ok) throw new Error("No se puedo realizar la correcion");

        const data = await resp.json() as OrthographyReponse;

        return {
            ok: true,
            ...data
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            useScore: 0,
            errors: [],
            message: "No se pudo realizar la correcion"
        }
    }

}