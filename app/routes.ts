import { type RouteConfig, index } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    { path: "productos", file: "routes/products.tsx" },
    { path: "login", file: "routes/login.tsx" },
    { path: "registro", file: "routes/register.tsx" },
    { path: "contacto", file: "routes/contacto.tsx" },
    { path: "recuperar", file: "routes/forgot-password.tsx" },
    { path: "cart", file: "routes/cart.tsx" },
] satisfies RouteConfig;
