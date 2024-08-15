import { ProsConsResponse } from "@interfaces/pros-cons.response";
import { environment } from "environments/environment"

export const proConsUseCase = async (prompt: string) => {


    try {
        const resp = await fetch(`${environment.backendApi}/pros-cons-discusser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt }),
        });

        if (!resp.ok) throw new Error("No se pudo realizar la comparacion");

        const data = await resp.json() as ProsConsResponse;

        return {
            ok: true,
            ...data
        }

    } catch (error) {
        console.log(error);
        return {
            ok: false,
            role: "",
            conenten: "No se pudo realizar la comparacion"
        }
    }

}