# TypeScript Discord Bot

This repository contains a TypeScript-based Discord bot. Follow the steps below to set up and run the bot.

## Prerequisites

1. **Install [Bun](https://bun.sh)**  
    Bun is a fast JavaScript runtime. Follow the instructions on the [official website](https://bun.sh) to install it.

2. **Install MongoDB Community Edition**  
    Download and install MongoDB Community Edition from [MongoDB's official website](https://www.mongodb.com/try/download/community).

## Setup Instructions

1. Clone the repository to your local machine:
    ```bash
    git clone <repository-url>
    cd TypeScript-Discord-Base
    ```

2. Install dependencies using Bun:
    ```bash
    bun i
    ```

3. Configure environment variables:
    - Create a `.env` file by renaming `.env.temp` to `.env`:
      ```bash
      mv .env.temp .env
      ```
    - Open the `.env` file and fill in the required values (e.g., Discord bot token, MongoDB connection string, etc.).

4. Start the bot:
    ```bash
    bun .
    ```

## Notes

- Ensure MongoDB is running locally or accessible via the connection string provided in the `.env` file.
- If you encounter any issues, check the logs for debugging information.

Enjoy using the bot!