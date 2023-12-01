# Report

This document provides a high-level overview of this software's architecture and its lifecycle. We have documented our approach and thinking for each stage of the software's lifecycle and what each process yielded.

We also go over more difficulties and challenges that we've encountered in more detail in the Appendix.

## Prerequisites

This report assumes the reader already has knowledge and understanding of the terms used when discussing the Tomasulo algorithm/architecture, such as reservation stations/buffers, as well as general computer architecture terms/concepts, but all are not completely required in order to proceed.

## Table of Contents

-   [Architecture and Design](#architecture-and-design)
-   [Implementation](#implementation)
-   [Testing](#testing)
-   [Appendix](#appendix)

## Architecture and Design

This chapter documents an overview of our software's architecture and design.

### The Tomasulo Algorithm

Due to the heavy dependencies of the features of this program on each other, and how almost every component needs data to flow to it from another component, and the absence of time to draw system diagrams and strictly define how data would flow throughout the system, we decided to start writing down a text description of the tomasulo algorithm and dumped all the details we could think of and the challenges that we would face during implementation and our (possible?) solutions to them. You can find this description in the `algorithm.txt` file under this directory.

We have also made a list of assumptions with regards to the algorithm, hardware architecture, instruction syntax, and more. You can find these assumptions in the `assumptions.md` file under this directory.

### The Tomasulo Architecture

To keep track of the real hardware architecture and to properly simulate it, we took as reference a couple of diagrams which can be found under this directory, entitled `architecture_1.png` and `architecture_2.png`. Both are taken from the German University in Cairo's Microprocessors Course for the year 2023, by Dr. Milad Ghantous.

### Application Data Flow

Our software uses a client-server architecture.

The client takes the inputs from the user like instructions, instruction latencies, buffer sizes, etc. - which are necessary to configure a run of the Tomasulo algorithm - then makes a HTTP request to the server using these inputs and waits for the response. (See `Appendix` for an interesting story as to why we chose client-server)

The server then proceeds to run the algorithm using the inputs from the received HTTP request, records the required values at each clock cycle such as station and buffer values, and returns them in an array to the client in an HTTP response.

The client then takes over with the simulation, allowing the user to cycle through each clock cycle and view a snapshot of the system at the end of that cycle.

### OO Design

We have decided to use Object Orientation (OO) as the approach for our backend logic.

We use classes to simulate the hardware components, and interfaces and abstract classes to better organize code dependencies. Here are some of our classes:

-   `ReservationStation` (Abstract Class)
-   `AddSubReservationStation` (Concrete Class)
-   `Buffer` (Abstract Class)
-   `LoadBuffer` (Concrete Class)
-   `Executable` (Interface)
-   `DataCache`
-   `InstructionCache`
-   `InstructionQueue`
-   `CommonDataBus`
-   `RegisterFile`

We also have Handler classes to carry out the logic of each stage in the Tomasulo pipeline. Some of those classes are:

-   `FetchHandler`
-   `IssueHandler`
-   `ExecuteHandler`
-   `WriteHandler`

Finally, our `Tomasulo` class, which is the main class, contains our program's main loop that runs until the input program instructions end, and uses the other classes to run the full pipeline stages every cycle.

### Technology Stack

Our language of choice was either going to be Java or TypeScript due to our familiarity with them and the availability of OO features in both of them. Since we knew we would develop a GUI, we opted for TypeScript so we can use one language for both frontend and backend.

We used React with Typescript and Material UI (MUI) styled components to create our GUI. Other than that, we did not use any other fancy technologies.

## Implementation

This chapter documents the implementation of our software.

### Overview

The first thing we implemented was the inputs page for users to input the program configurations, and then we directed all of our effort to the backend. After we were done implementing the backend and testing it manually in the CLI (more on testing in the `Testing` chapter), we proceeded to implement our GUI to display the output and refined the input page.

### Backend

We began visualizing how our backend would work by referencing our written algorithm and our hardware overview diagrams to maintain as realistic of an implementation as possible. (This also led us to an interesting problem on simulation realism, see more in the `Appendix`)

We wrote the majority of our backend code in group coding sessions as the tasks could not be split across the team members due to the heavy dependencies.

We spent much of our time refactoring and cleaning up after implementing each feature as well as thinking about how data would flow to and from it, how it relates to other components, where it sits in the system overview and any edge cases that would cause it to break. This dedication minimized the presence of bugs in our codebase **_significantly_** and made testing quite simple, and whenever we did find a bug, we could easily fix it or integrate a feature that was missing because our code's design allowed for it.

### Frontend

We implemented our frontend using React.

We have two pages, or rather two "big" components that you can consider to represent pages, one for getting the inputs and the other for displaying the outputs.

We did not need to use any routing, as we only needed the root route `/` in which we initially rendered the inputs page, and then rendered the outputs page in the same route after the inputs are submitted.

Our client-side data was passed around using React Context, and validated using react-hook-form and zod. Instructions are MIPS x64 instructions and are either inputted in a text area or in a uploaded in a .txt file, and in either way they are parsed to an array of instructions.

Our frontend was fairly straightforward to implement. Check our main `README.md` file for a demo to see it in action!

### Code Structure

Our codebase is split into two main folders (excluding the docs folder and any other non logic-related folders), those being `client` and `server`. These two would be deployed separately but in our case, we just run in the localhost, so we can comfortably keep them both under the same repository and run each of them on their port on the localhost and have them communicate via HTTP normally.

```
TODO:
ADD THE FOLDER STRUCTURE
```

### Workflow

We maintained a constant feedback loop of incrementally adding features and refactoring after adding each one of them to keep the codebase clean and maintainable.

We used GitHub Issues to track bugs, necessary features and questions.

## Testing

This chapter documents the testing phase of our software.

### Running the Code

Early on, to run our backend, we created a server that just runs the algorithm once we run the server and then exits. We added console logs throughout our codebase to test the output in each component at every cycle and evaluated the outputs.

This was enough for us initially when testing using the CLI. However, we later transitioned to an express server to be able to listen on a port and have the client make requests to the server to run the algorithm and retrieve the results to display in the GUI.

### Test Cases

```
TODO:
ADD THE TEST CASES
```

## Appendix

This chapter provides extra details, obstacles and challenges that we ran into, should you be interested.

### The N-1 Bug

Initially, we were not going to separate our application into a client and server, and we were just going to have frontend and backend logic all in one place with no need to make network requests between the frontend and backend, which was - and still seems like - the obvious, intuitive way to go about an application like this.

However, we ran into an absurdly rare bug in which we tried setting a value of a field in an object to a number, and what happened was that number would always get set as that number minus one. No matter what number N we gave it, it would give us back N-1. We tried everything, and the error made absolutely no sense. We console logged the value inside the setter for this object's field, and it was N inside the setter, even after setting the value, but then after exiting the setter method and going back, and console logging in the next line directly after calling the setter on this object, the value would be N-1.

The only way that it was fixed was when we separated our backend logic into a server and called that server from our React client.

We reached a conclusion that this bug is due to some 0.00001% chance error (probably an exaggeration, but you get the point) that is caused by the Typescript compiler due to some unusual arrangement of dependencies in our project.

Due to our limited time, we decided not to delve deeper into investigating how to resolve this issue and not go searching for answers for weird compiler problems that we were unlikely to come across a ready solution for. Thus, we decided to swallow the pill and stick to client-server architecture.

### To Simulate or Not to Simulate

When coding up a project such as this one, there comes a point where the line becomes blurry as to how realistic your simulation should really be.

At the end of the day, we are attempting to simulate hardware components, using nothing but software.

Here's the problem.

> How far do you go in simulating the real thing?

> How far is too far?

> Where is the point in which you can stop and say this simulation is real enough?

In our case, we reached a point where an Adder, for example, had to write its result to the bus - which is nothing but a bunch of wires to transmit the data. We found ourselves asking whether we should simulate the bus, making a class for the bus and having the components then read from it.

Now, we ended up adding the `CommonDataBus` class, effectively simulating these wires, but one does not have to stop there. We can just keep going on and on and on with no end to this. We could keep simulating down to the level of the logic gates.

Another thing is, many times during this project we found ourselves thinking that implementing the real thing would've been easier, because we have to make up fake scenarios and ways that go against the actual logic of the thing we're actually trying to simulate, because it is just that - a simulation. It's not the real thing, so you often have to go out of your way to do things that go against the real logic in order to make the simulation work.

Perhaps this is all too philosophical. Perhaps it is nonsensical. Perhaps this is just how it is with these kinds of projects.
