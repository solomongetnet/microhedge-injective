// app/components/ShortcutHandler.js

"use client";

import React, { useEffect } from "react";
import keyboard from "keyboardjs"; // Or hotkeys-js

function ShortcutHandler() {
  useEffect(() => {
    const actions = {
      "ctrl+b": () => {
        console.log("Function 1 called (no UI)!");
        alert("Ctrl + b");
      },
      "ctrl+c": () => {
        console.log("Function 2 called (no UI)!");
        // Perform action 2
      },
      "alt+q": () => {
        console.log("Function 3 called (no UI)!");
        // Perform action 3
      },
    };

    for (const shortcut in actions) {
      if (actions.hasOwnProperty(shortcut)) {
        // @ts-ignore
        keyboard.bind(shortcut, actions[shortcut]);
        console.log(`Shortcut '${shortcut}' registered (no UI).`);
      }
    }

    return () => {
      for (const shortcut in actions) {
        if (actions.hasOwnProperty(shortcut)) {
          keyboard.unbind(shortcut);
          console.log(`Shortcut '${shortcut}' unregistered (no UI).`);
        }
      }
    };
  }, []); // Empty dependency array

  // This component has no UI to render.  It's just for side effects.
  return null;
}

export default ShortcutHandler;
