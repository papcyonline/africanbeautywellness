"use client";

import { useActionState } from "react";
import { loginAction } from "./actions";
import styles from "./login.module.css";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});

  return (
    <form action={action} className={styles.form}>
      <label className={styles.label} htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        className={styles.input}
        autoFocus
        autoComplete="current-password"
      />
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <button
        type="submit"
        className={`btn btn-primary ${styles.submit}`}
        disabled={pending}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
