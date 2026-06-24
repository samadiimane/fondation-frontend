"use client";

import { useMemo, useState } from "react";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  profileType: "",
  institution: "",
  field: "",
  requestType: "",
  message: "",
  cityCountry: "",
  academicLevel: "",
  preferredContact: "",
  consent: false,
  website: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sanitizeText = (value = "") =>
  String(value)
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const sanitizeMultiline = (value = "") =>
  String(value)
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, " ")
    .trim();

const sanitizePhone = (value = "") =>
  String(value)
    .replace(/[^\d+\s().-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const isValidEmail = (value) => EMAIL_PATTERN.test(value);

const JoinUsForm = ({ content }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const fieldIds = useMemo(
    () => ({
      fullName: "join-us-full-name",
      email: "join-us-email",
      phone: "join-us-phone",
      profileType: "join-us-profile-type",
      institution: "join-us-institution",
      field: "join-us-field",
      requestType: "join-us-request-type",
      message: "join-us-message",
      cityCountry: "join-us-city-country",
      academicLevel: "join-us-academic-level",
      preferredContact: "join-us-preferred-contact",
      consent: "join-us-consent",
      website: "join-us-website",
    }),
    []
  );

  const validate = (values) => {
    const nextErrors = {};
    const fullName = sanitizeText(values.fullName);
    const email = sanitizeText(values.email).toLowerCase();
    const institution = sanitizeText(values.institution);
    const field = sanitizeText(values.field);
    const message = sanitizeMultiline(values.message);

    if (fullName.length < 3) nextErrors.fullName = content.validation.fullName;
    if (!isValidEmail(email)) nextErrors.email = content.validation.email;
    if (!values.profileType) nextErrors.profileType = content.validation.profileType;
    if (!institution) nextErrors.institution = content.validation.institution;
    if (!field) nextErrors.field = content.validation.field;
    if (!values.requestType) nextErrors.requestType = content.validation.requestType;
    if (message.length < 20) nextErrors.message = content.validation.message;
    if (!values.consent) nextErrors.consent = content.validation.consent;

    return nextErrors;
  };

  const buildPayload = (values) => ({
    fullName: sanitizeText(values.fullName),
    email: sanitizeText(values.email).toLowerCase(),
    phone: sanitizePhone(values.phone),
    profileType: sanitizeText(values.profileType),
    institution: sanitizeText(values.institution),
    field: sanitizeText(values.field),
    requestType: sanitizeText(values.requestType),
    message: sanitizeMultiline(values.message),
    cityCountry: sanitizeText(values.cityCountry),
    academicLevel: sanitizeText(values.academicLevel),
    preferredContact: sanitizeText(values.preferredContact),
    consent: Boolean(values.consent),
  });

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus("idle");

    if (sanitizeText(form.website)) {
      setStatus("success");
      setForm(INITIAL_FORM);
      setErrors({});
      return;
    }

    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("invalid");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/join-us", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(form)),
      });

      if (!response.ok) {
        throw new Error("Join request failed");
      }

      setStatus("success");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch {
      setStatus("error");
    }
  };

  const renderError = (name) => {
    if (!errors[name]) return null;
    return (
      <p className="join-us-form__error" id={`${fieldIds[name]}-error`}>
        {errors[name]}
      </p>
    );
  };

  const describedBy = (name) => (errors[name] ? `${fieldIds[name]}-error` : undefined);

  return (
    <form className="join-us-form" onSubmit={handleSubmit} noValidate>
      <div className="join-us-form__status" aria-live="polite">
        {status === "success" ? (
          <p className="join-us-form__notice join-us-form__success">{content.success}</p>
        ) : null}
        {status === "error" ? (
          <p className="join-us-form__notice join-us-form__failure">{content.failure}</p>
        ) : null}
        {status === "invalid" ? (
          <div className="join-us-form__notice join-us-form__failure" role="alert">
            <p>{content.errorSummary}</p>
          </div>
        ) : null}
      </div>

      <p className="join-us-form__required">{content.requiredHint}</p>

      <div className="join-us-form__honeypot" aria-hidden="true">
        <label htmlFor={fieldIds.website}>{content.fields.website}</label>
        <input
          id={fieldIds.website}
          name="website"
          type="text"
          value={form.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="join-us-form__grid">
        <div className="join-us-form__field">
          <label htmlFor={fieldIds.fullName}>{content.fields.fullName} *</label>
          <input
            id={fieldIds.fullName}
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            placeholder={content.placeholders.fullName}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={describedBy("fullName")}
            autoComplete="name"
          />
          {renderError("fullName")}
        </div>

        <div className="join-us-form__field">
          <label htmlFor={fieldIds.email}>{content.fields.email} *</label>
          <input
            id={fieldIds.email}
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder={content.placeholders.email}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            autoComplete="email"
            dir="ltr"
          />
          {renderError("email")}
        </div>

        <div className="join-us-form__field">
          <label htmlFor={fieldIds.profileType}>{content.fields.profileType} *</label>
          <select
            id={fieldIds.profileType}
            name="profileType"
            value={form.profileType}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.profileType)}
            aria-describedby={describedBy("profileType")}
          >
            <option value="">{content.placeholders.select}</option>
            {content.profileTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {renderError("profileType")}
        </div>

        <div className="join-us-form__field">
          <label htmlFor={fieldIds.phone}>{content.fields.phone}</label>
          <input
            id={fieldIds.phone}
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder={content.placeholders.phone}
            autoComplete="tel"
            dir="ltr"
          />
        </div>

        <div className="join-us-form__field">
          <label htmlFor={fieldIds.institution}>{content.fields.institution} *</label>
          <input
            id={fieldIds.institution}
            name="institution"
            type="text"
            value={form.institution}
            onChange={handleChange}
            placeholder={content.placeholders.institution}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.institution)}
            aria-describedby={describedBy("institution")}
          />
          {renderError("institution")}
        </div>

        <div className="join-us-form__field">
          <label htmlFor={fieldIds.field}>{content.fields.field} *</label>
          <input
            id={fieldIds.field}
            name="field"
            type="text"
            value={form.field}
            onChange={handleChange}
            placeholder={content.placeholders.field}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.field)}
            aria-describedby={describedBy("field")}
          />
          {renderError("field")}
        </div>

        <div className="join-us-form__field">
          <label htmlFor={fieldIds.requestType}>{content.fields.requestType} *</label>
          <select
            id={fieldIds.requestType}
            name="requestType"
            value={form.requestType}
            onChange={handleChange}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.requestType)}
            aria-describedby={describedBy("requestType")}
          >
            <option value="">{content.placeholders.select}</option>
            {content.requestTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {renderError("requestType")}
        </div>

        <div className="join-us-form__field">
          <label htmlFor={fieldIds.cityCountry}>{content.fields.cityCountry}</label>
          <input
            id={fieldIds.cityCountry}
            name="cityCountry"
            type="text"
            value={form.cityCountry}
            onChange={handleChange}
            placeholder={content.placeholders.cityCountry}
            autoComplete="address-level2"
          />
        </div>

        <div className="join-us-form__field">
          <label htmlFor={fieldIds.academicLevel}>{content.fields.academicLevel}</label>
          <input
            id={fieldIds.academicLevel}
            name="academicLevel"
            type="text"
            value={form.academicLevel}
            onChange={handleChange}
            placeholder={content.placeholders.academicLevel}
          />
        </div>

        <div className="join-us-form__field">
          <label htmlFor={fieldIds.preferredContact}>{content.fields.preferredContact}</label>
          <input
            id={fieldIds.preferredContact}
            name="preferredContact"
            type="text"
            value={form.preferredContact}
            onChange={handleChange}
            placeholder={content.placeholders.preferredContact}
          />
        </div>

        <div className="join-us-form__field join-us-form__field--full">
          <label htmlFor={fieldIds.message}>{content.fields.message} *</label>
          <textarea
            id={fieldIds.message}
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder={content.placeholders.message}
            required
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
            rows={6}
          />
          {renderError("message")}
        </div>

        <div className="join-us-form__field join-us-form__field--full">
          <label className="join-us-form__consent" htmlFor={fieldIds.consent}>
            <input
              id={fieldIds.consent}
              name="consent"
              type="checkbox"
              checked={form.consent}
              onChange={handleChange}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={describedBy("consent")}
            />
            <span>{content.consent}</span>
          </label>
          {renderError("consent")}
        </div>
      </div>

      <div className="join-us-form__actions">
        <p>{content.helper}</p>
        <button type="submit" className="btn--primary" disabled={status === "sending"}>
          {status === "sending" ? content.sending : content.submit}
        </button>
      </div>
    </form>
  );
};

export default JoinUsForm;

