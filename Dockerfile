# Use the Node.js 18 Alpine Linux image as the base image
FROM node:18-alpine 

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json files into the working directory
COPY package*.json ./

# Install the dependencies specified in package.json
RUN npm install -g npm
RUN npm install

# Copy all the files from the local directory to the working directory in the container
COPY . .

# Build the project (typically used for building front-end assets)
# RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Copy the .next directory to the working directory in the container (if needed for a Next.js app)
COPY .next ./.next

# Run the application in development mode
CMD ["npm", "run", "dev"]