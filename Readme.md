# A Real-Life game interface for Among Us
This project is fan made and has no connection to Innersloth or any official Among Us products. 
As permitted by Innersloth, this is a non-commercial, private and open source project: https://www.innersloth.com/fan-creation-policy/ (Feb 12 2024).

The target is to create a server managed interface to create task-, hazard-, and meeting points in a real-life environment
to then run a GPS based game with the mechanics of Among Us via a web interface on every player's phone.

This Repository contains two and a half projects:
- **backend:** This is the server side implementation for handling the game and all player connections via web socket
- **frontend/web:** The React client side implementation that will be used as a user interface and inputting actions on the players phone or stationary computers
- **types**: A separate npm repository, that is only used to share typescript definitions between front- and backend to improve code consistency and avoid 