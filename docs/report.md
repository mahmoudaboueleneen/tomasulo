# Report

This document provides a high-level overview of this software's architecture and its lifecycle.

We have outlined our approach and thinking for each process and what each process yielded. We will also be covering other related topics and details.

## Table of Contents

-   [Architecture and Design](#architecture-and-design)
-   [Implementation](#implementation)
-   [Testing](#testing)
-   [Appendix](#appendix)

## Architecture and Design

This chapter documents an overview of our software's architecture and design.

### Data Flow

Our software uses a client-server architecture, where the client gets inputs from the user like instructions, instruction latencies, buffer sizes, etc. which are necessary to configure a run of the Tomasulo algorithm, then makes a HTTP request to the server using these inputs and waits for the response. (See `Appendix` for an interesting story as to why we chose client-server)

The server then proceeds to run the algorithm using the inputs from the received HTTP request, records the required values at each clock cycle such as station and buffer values, and returns them in an array to the client in an HTTP response.

The client then takes over with the simulation, allowing the user to cycle through each clock cycle and view a snapshot of the system at the end of that cycle.

### OO Design

We have decided to use Object Orientation (OO) for our backend logic. We use classes to simulate the hardware components, and interfaces and abstract classes to better organize code dependencies. Here are some of our classes:

-   ReservationStation (Abstract Class)
-   AddSubReservationStation (Concrete Class)
-   Buffer (Abstract Class)
-   LoadBuffer (Concrete Class)
-   Executable (Interface)
-   DataCache
-   InstructionCache
-   InstructionQueue
-   CommonDataBus
-   RegisterFile

We also had Handler classes to carry out the logic of each stage in the Tomasulo pipeline. Here are some of those classes:

-   FetchHandler
-   IssueHandler
-   ExecuteHandler
-   WriteHandler

Finally, our Tomasulo class, which is the main class, contains our program's main loop that runs until the program ends, and uses the other classes to run the full pipeline stages every cycle.

### Technology Stack

Our language of choice was either going to be Java or TypeScript due to our familiarity with both, but since we knew we would develop a GUI, we opted for TypeScript so we can use one language for the frontend and the backend.

We also knew TypeScript had OO features so that made the decision possible.

We used React with Typescript and MUI styled components to create our GUI. Other than that, we did not use any other fancy technologies.

## Implementation

Initially, we implemented a simple page for users to input the program configurations, and then we directed all of our focus to the backend. After we were done implementing the backend and testing it manually in the CLI (more on testing in the `Testing` chapter), we proceeded to implement our GUI to display the output and refined the input page.

### Backend

Due to the tight coupling of the features of this program, and almost every component needing data to flow to it from another component, and the absence of time to draw system diagrams and strictly define how data would flow in the system, we decided to start writing down a text description of the tomasulo algorithm and dumped all the details we could think of and the challenges that we would face during implementing it and our solutions to them. You can find this description in the `algorithm.txt` file in this directory.

We then proceeded to do group coding sessions as the tasks could not be split across the team members, and we spent much of our time refactoring and cleaning up after implementing each feature as well as thinking about how data would flow to and from it, how it relates to other components, where it sits in the system overview and any edge cases that would cause it to break. This dedication greatly minimized the presence of bugs in our codebase and made testing quite simple, and whenever we did find a bug, we could easily fix it or integrate a feature that was missing because our code's design allowed for it.

### Frontend

### Code Structure

Our codebase is split into two main folders (excluding the docs folder and any other non logic-related folder), those being `client` and `server`. These two would be be deployed separately but in our case, we just run in the local host.

```
TODO:
ADD THE FOLDER STRUCTURE
```

## Testing

This chapter documents our testing process.

### Running the Code

Early on, to run our backend, we created a server that just runs the algorithm once called and then exits. We then added console logs throughout our codebase to test the output in each component at every cycle and evaluated the outputs.

This was enough for us initially when testing using the CLI. However, later we transitioned the server to an express server to be able to listen on a port and have the client make requests to the server to run the algorithm.

### Test Cases

```
TODO:
ADD THE TEST CASES
```

## Appendix

This chapter provides extra details, obstacles and challenges that we ran into, should you be interested.

### The N-1 Bug

Initially, we were not going to separate our application into a client and server, and we were just going to have frontend and backend logic all under one big `src` folder.

However, we ran into a bug in which we tried setting a value of an object to a number, and what happened was that number would always be set as that number minus one. We tried everything, and the error made absolutely no sense and the only way that it was fixed was when we separated our backend logic into a server and called that server from our React client.

We reached a conclusion that this bug is due to a 0.00001% chance error (probably an exaggeration, but you get it) that is caused by the Typescript compiler due to some unusual arrangement of dependencies in our project.

Due to our limited time, we decided not to delve deeper into investigating how to resolve this issue and not go searching for answers for weird compiler problems that we were unlikely to come across a ready solution for. Thus, we decided to swallow the pill and stick to client-server architecture.
