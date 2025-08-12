export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/reservas",
        "/favoritos",
        "/reservas-recebidas",
        "/vagas"
    ]
}