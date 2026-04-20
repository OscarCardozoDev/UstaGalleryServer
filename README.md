# UstaGalleryServer Documentation

## Overview
UstaGalleryServer is a robust backend application designed for managing gallery services. This documentation provides comprehensive instructions on using Bun commands to interact with the server.

## Getting Started
To get started with UstaGalleryServer, ensure you have Bun installed. You can install it using the following command:

```bash
yarn global add bun
```

### Running the Application
Use Bun to start the server:

```bash
bun run start
```

### Endpoints
1. **GET /api/galleries**  
   Retrieves a list of galleries.
   **Example:**  
   ```bash
   curl -X GET http://localhost:3000/api/galleries
   ```
   **Response:**  
   ```json
   [
       {
           "id": 1,
           "name": "Gallery One"
       },
       {
           "id": 2,
           "name": "Gallery Two"
       }
   ]
   ```

2. **POST /api/galleries**  
   Creates a new gallery.
   **Example:**  
   ```bash
   curl -X POST http://localhost:3000/api/galleries -H 'Content-Type: application/json' -d '{"name":"New Gallery"}'
   ```
   **Response:**  
   ```json
   {
       "id": 3,
       "name": "New Gallery"
   }
   ```

3. **GET /api/galleries/{id}**  
   Retrieves a gallery by ID.
   **Example:**  
   ```bash
   curl -X GET http://localhost:3000/api/galleries/1
   ```
   **Response:**  
   ```json
   {
       "id": 1,
       "name": "Gallery One"
   }
   ```

4. **DELETE /api/galleries/{id}**  
   Deletes a gallery by ID.
   **Example:**  
   ```bash
   curl -X DELETE http://localhost:3000/api/galleries/1
   ```
   **Response:**  
   ```json
   {
       "message": "Gallery deleted successfully."
   }
   ```

## Best Practices
- Always validate input data before processing.
- Use meaningful names for galleries to enhance organization.
- Monitor server logs for troubleshooting and performance tuning.

## Conclusion
This documentation serves as a starting point for effectively using the UstaGalleryServer with Bun. For more detailed information, refer to the official documentation or explore the codebase directly.