import { mount } from "svelte";
import { dismissSplash } from "kaizen-ui";
import App from "./App.svelte";
import "./app.css";

mount(App, { target: document.getElementById("app") });
dismissSplash();
