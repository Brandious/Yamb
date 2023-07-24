# Yamb
Yamb game based on NestJS and NextJS 

## NestJS, NextJS, WebSockets, Postgres, Docker

    Backend built with NestJS utilizing OOP for building abstractions over communication layer which is websockets, typeORM as orm for database operations.

    Frontend leverages NextJS, react approach to building user interfaces using mui components, recoil state handling form granual control over state management and sockets.io for communication with server.

    Everything wrapped in nice Docker container which with .env files modified can be triggered with one make command found in makefile in root directory.

    Currently docker runs only prod versions of app so there is no watch changes and all that fast reload sugar on top.
    Wanna run dev just spin make dev with appropriate .env variables 


## Monolitic Architecture leveraging workspaces

    Monolitic architecture leveraging npm workspaces makes for a interesting file handling for single player, small team or full stack developer.

    What it does it gives root folder insight and starting point for all other parts of our application. Combines all movebale parts into one single folder structure with root folder as starting point after which we can share code, components and anything else between different segments of our application using @root-name starter.


Makefile in the root directory is pretty much self explanitory, before triggering one you should first 
