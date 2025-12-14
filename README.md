1) Inicializar el entorno de prisma con el comando:

    npx prisma init 

    1.1) Para crear una base de datos con prisma para el entorno de desarrollo se ejecuta el siguiente comando:

    npx prisma dev



// ---------------------------------------- DOCKER ---------------------------------------- //

2) Crear la base de datos con postgres, una imagen de postgres en docker:

    docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

    2.1) Para revizar si ya esta creada la imagen de la base de datos, se usa el siguiente comando:

    docker ps

    2.2) En caso de que no este corriendo, se debe ejecutar el siguiente comando:

    docker start db

    2.2) Para ingresar a la base de datos en la imagen, se puede ejecutar el siguiente comando:
    
        docker exec -it db bash    

3) Crear el schema de la base de datos con prisma:

    npx prisma db push

4) Correr el servidor:

    npm run dev