This documentation(README.md) ensures that the users understand how to interact with it, what to expect from each endpoint, and how to handle different responses.

## RESTFUL API

The application is a simple RESTful API for managing products.
It provides endpoints for creating, retrieving, updating, partially updating,
and deleting product information stored in a JSON file.

### Properties or fields associated with the chosen resource.

For the given product resource, the properties or fields associated with each product can be simply defined as follows:

- id: A unique identifier for each product.
- name: The name of the product.
- description: A brief description of the product's features and benefits.
- price: The current selling price of the product.
- category: The category under which the product falls, such as Electronics, Computers, Audio, Gaming, Wearables, Books, Health & Fitness, or Home Security.

These fields provide essential information about each product, making it straightforward for users to understand what each product offers and its place within the broader product catalog.

### Modules used:

The HTTP server it uses the following standard modules:

1. http: This module is used to create the HTTP server.
2. fs: This module is used for file system operations, specifically to read from and write to JSON files.
3. path: This module is used for handling and transforming file paths.

#### Implementation handles the following HTTP methods:

- GET: To retrieve all products or a specific product by ID.
- POST: To create a new product.
- PUT: To update an existing product completely by ID.
- PATCH: To update specific fields of an existing product by ID.
- DELETE: To delete a product by ID.

### Here is a brief overview of what each part of the code does:

1. Helper Functions:

- readDataFromFile: Reads and parses JSON data from a specified file.
- writeDataToFile: Writes JSON data to a specified file.
- getRequestBody: Collects and parses the body of an incoming request.

2. HTTP Server Setup:

- The server listens on port 3000 and handles requests based on the URL and HTTP method.
- Routes are defined to handle specific endpoints and methods.

3. Request Handlers:

- getAllProducts: Retrieves all products.
- getProductById: Retrieves a specific product by ID.
- createProduct: Creates a new product.
- updateProduct: Updates an existing product entirely.
- patchProduct: Partially updates an existing product.
- deleteProduct: Deletes a product by ID.

### Error Handling

- Client Errors: For invalid input, the API returns 400 Bad Request with a descriptive error message.
- Not Found Errors: If a product is not found, the API returns 404 Not Found with an appropriate message.
- Server Errors: For unexpected issues, the API returns 500 Internal Server Error with a generic error message.

### Validation Requirements

- Create Product: Requires id, name, and description fields.
- Update Product: Requires id, name, and description fields.
- Patch Product: Requires at least one field to update.

### Testing with Postman

- Start the Server: Ensure your server is running with node server.js.

1. GET All Products:

- URL: http://localhost:3000/product
- Method: GET

2. GET Product by ID:

- URL: http://localhost:3000/product/1
- Method: GET

3. POST Create Product:

- URL: http://localhost:3000/product
- Method: POST
- Body (JSON):
- json
- Copy code

"id": 3,<br>
"name": "Product 3",<br>
"description": "Description of Product 3"

4. PUT Update Product:

- In the Headers tab, set Content-Type to application/json.
- URL: http://localhost:3000/product/1
- Method: PUT
- Body (JSON):
- json
- Copy code

"id": 1,<br>
"name": "Updated Product 1",<br>
"description": "Updated Description of Product 1"

5. PATCH Partially Update Product:

- In the Headers tab, set Content-Type to application/json.
- URL: http://localhost:3000/product/1
- Method: PATCH
- Body (JSON):
- json
- Copy code

"description": "Partially Updated Description of Product 1"

6. DELETE Product:

- URL: http://localhost:3000/product/1
- Method: DELETE
