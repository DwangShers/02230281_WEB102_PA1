const http = require("http");
const fs = require("fs").promises;
const path = require("path");

// Helper function to read data from a JSON file
const readDataFromFile = async (filePath) => {
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
};

// Helper function to write data to a JSON file
const writeDataToFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Helper function to get request body
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(body);
    });
    req.on("error", (err) => {
      reject(err);
    });
  });
};

// File path for storing data
const dataFilePath = path.join(__dirname, "product.json");

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method.toUpperCase();

  if (pathname === "/product" && method === "POST") {
    createProduct(req, res);
  } else if (pathname === "/product" && method === "GET") {
    getAllProducts(res);
  } else if (pathname.startsWith("/product/")) {
    const id = pathname.split("/")[2];
    if (method === "GET") {
      getProductById(id, res);
    } else if (method === "PUT") {
      updateProduct(req, id, res);
    } else if (method === "PATCH") {
      patchProduct(req, id, res);
    } else if (method === "DELETE") {
      deleteProduct(id, res);
    } else {
      res.statusCode = 405;
      res.end("Method Not Allowed");
    }
  } else {
    res.statusCode = 404;
    res.end("Not Found");
  }
});

// Listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

async function getAllProducts(res) {
  try {
    const products = await readDataFromFile(dataFilePath);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(products));
  } catch (error) {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

async function getProductById(id, res) {
  try {
    const products = await readDataFromFile(dataFilePath);
    const product = products.find((p) => p.id.toString() === id);
    if (product) {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(product));
    } else {
      res.statusCode = 404;
      res.end("Product Not Found");
    }
  } catch (error) {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

async function createProduct(req, res) {
  try {
    const requestBody = await getRequestBody(req);
    const newProduct = JSON.parse(requestBody);

    // Validate the new product (e.g., ensure it has an id)
    if (!newProduct.id || !newProduct.name || !newProduct.description) {
      res.statusCode = 400;
      res.end("Bad Request: Missing required fields (id, name, description)");
      return;
    }

    const products = await readDataFromFile(dataFilePath);
    products.push(newProduct);
    await writeDataToFile(dataFilePath, products);

    res.statusCode = 201;
    res.setHeader("Location", `/product/${newProduct.id}`);
    res.end("Product Created");
  } catch (error) {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

async function updateProduct(req, id, res) {
  try {
    const requestBody = await getRequestBody(req);
    const updatedProduct = JSON.parse(requestBody);

    const products = await readDataFromFile(dataFilePath);
    const index = products.findIndex((p) => p.id.toString() === id);
    if (index !== -1) {
      products[index] = updatedProduct;
      await writeDataToFile(dataFilePath, products);

      res.statusCode = 200;
      res.end("Product Updated");
    } else {
      res.statusCode = 404;
      res.end("Product Not Found");
    }
  } catch (error) {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

async function patchProduct(req, id, res) {
  try {
    const requestBody = await getRequestBody(req);
    const patchData = JSON.parse(requestBody);

    const products = await readDataFromFile(dataFilePath);
    const index = products.findIndex((p) => p.id.toString() === id);
    if (index !== -1) {
      const product = products[index];
      Object.assign(product, patchData); // Merge patchData into product
      await writeDataToFile(dataFilePath, products);

      res.statusCode = 200;
      res.end("Product Updated");
    } else {
      res.statusCode = 404;
      res.end("Product Not Found");
    }
  } catch (error) {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}

async function deleteProduct(id, res) {
  try {
    const products = await readDataFromFile(dataFilePath);
    const index = products.findIndex((p) => p.id.toString() === id);
    if (index !== -1) {
      products.splice(index, 1);
      await writeDataToFile(dataFilePath, products);
      res.statusCode = 204;
      res.end("");
    } else {
      res.statusCode = 404;
      res.end("Product Not Found");
    }
  } catch (error) {
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
