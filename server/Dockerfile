FROM node:20.8.1

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (default for Express is 3000)
EXPOSE 3000

# Start the Express server
CMD ["npm", "start"]
