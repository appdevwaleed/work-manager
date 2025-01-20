import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Next.js API Documentation",
      version: "1.0.0",
      description: "API documentation for Next.js application",
    },
    servers: [
      {
        url: "http://localhost:3000/api", // Base URL of your API
      },
    ],
  },
  apis: ["./api/**/*.js"], // Path to your API files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
