"use client";

import { useState } from "react";

// Mailing-list sign-up that posts straight to a Kit form, so fans stay on
// the page. Kit answers JSON when asked for it. If the request cannot be made
// (Kit unreachable, a browser blocking it), the form submits the ordinary
// way instead and the fan lands on Kit's own confirmation page; without
// JavaScript it does that from the start. Nothing is lost either way.
//
// Kit's forms use double opt-in by default: the fan gets an email and must
// click to confirm, hence "check your inbox".

type State = "idle" | "sending" | "done" | "error";

export function EmailSignup({ formId }: { formId: string }) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const action = `https://app.kit.com/forms/${formId}/subscriptions`;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // a field people never see: only bots fill it in
    if (data.get("website")) {
      setState("done");
      return;
    }
    data.delete("website");
    setState("sending");
    let res: Response;
    try {
      res = await fetch(action, { method: "POST", body: data, headers: { Accept: "application/json" } });
    } catch {
      // could not reach Kit from here: let the browser post the form itself
      // (the trap field disabled, so it is not sent)
      const trap = form.querySelector<HTMLInputElement>(".signup__trap");
      if (trap) trap.disabled = true;
      form.submit();
      return;
    }
    const json = await res.json().catch(() => null);
    if (res.ok && json?.status === "success") {
      setState("done");
    } else {
      setState("error");
      setMessage(json?.errors?.messages?.[0] ?? "that didn't go through. check the address and try again.");
    }
  };

  if (state === "done") {
    return (
      <p className="signup__done" role="status">
        almost there: check your inbox and tap the link to confirm.
      </p>
    );
  }

  return (
    <form className="signup" action={action} method="post" onSubmit={onSubmit}>
      <label className="signup__label" htmlFor="signup-email">
        email address
      </label>
      <div className="signup__row">
        <input
          id="signup-email"
          className="signup__input"
          type="email"
          name="email_address"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          aria-describedby={state === "error" ? "signup-error" : undefined}
        />
        <button className="button signup__button" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "joining…" : "join"}
        </button>
      </div>
      <input className="signup__trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      {state === "error" && (
        <p id="signup-error" className="signup__error" role="alert">
          {message}
        </p>
      )}
      <p className="signup__fine">no spam. unsubscribe any time.</p>
    </form>
  );
}
