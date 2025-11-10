"use client";

import {useEffect, useState} from "react";
import {useTranslations} from "next-intl";

import HeaderFour from "@/components/HeaderFour";
import {Link, useRouter} from "@/i18n/navigation";
import useAuth from "@/hooks/useAuth";

const INITIAL_FORM = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const {login, isAuthenticated, initializing} = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      router.replace("/");
    }
  }, [initializing, isAuthenticated, router]);

  const handleChange = (event) => {
    const {name, value} = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await login(form.email, form.password);
      router.replace("/");
    } catch (submitError) {
      const detail = submitError?.payload?.detail || submitError?.message;
      setError(detail || t("error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <HeaderFour />
      <main className='py-5 py-md-5 bg-light'>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-12 col-lg-6'>
              <section className='card border-0 shadow-sm p-4 p-md-5'>
                <div className='d-flex flex-column gap-2'>
                  <h1 className='h3 mb-0'>{t("title")}</h1>
                  <p className='text-muted mb-0'>{t("subtitle")}</p>
                </div>
                <form className='mt-4' onSubmit={handleSubmit} noValidate>
                  <div className='mb-3'>
                    <label htmlFor='email' className='form-label'>
                      {t("emailLabel")}
                    </label>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      className='form-control'
                      placeholder={t("emailPlaceholder")}
                      autoComplete='email'
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='password' className='form-label'>
                      {t("passwordLabel")}
                    </label>
                    <input
                      id='password'
                      name='password'
                      type='password'
                      className='form-control'
                      placeholder={t("passwordPlaceholder")}
                      autoComplete='current-password'
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <p className='text-muted small mb-3'>{t("adminHint")}</p>
                  {error && (
                    <p className='text-danger small mb-3' role='alert' aria-live='assertive'>
                      {error}
                    </p>
                  )}
                  <div className='d-grid gap-3'>
                    <button
                      type='submit'
                      className='btn btn-primary'
                      disabled={submitting}
                      aria-busy={submitting}
                    >
                      {submitting ? t("loading") : t("submit")}
                    </button>
                    <Link href='/' className='btn btn-outline-secondary text-center'>
                      {t("back")}
                    </Link>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
