import React, { useState } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import styles from "./Register.module.scss";

interface Values {
  pseudo: string;
  email: string;
}

/**
 * Register formular component.
 * @returns the formular.
 */
const RegisterFormular = () => {
  return (
    <div className={styles.container}>
      <h4>Veuillez vous enregistrer</h4>
      <Formik
        initialValues={{
          pseudo: "",
          email: "",
        }}
        validationSchema={Yup.object().shape({
          pseudo: Yup.string()
            .min(3, "Trop cours !")
            .max(12, "Trop long !")
            .required("Requis !"),
        })}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          // TODO : return data to parent props
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }, 500);
        }}>
        {({ errors, touched }) => (
          <Form className={styles.register}>
            <div className={styles["input-container"]}>
              <Field
                id="pseudo"
                name="pseudo"
                placeholder=" "
                className={styles.input}
              />
              <div className={styles.cut}></div>
              <label htmlFor="pseudo" className={styles.placeholder}>
                Pseudo{" "}
                {errors.pseudo && touched.pseudo
                  ? `... ${errors.pseudo}`
                  : null}
              </label>
            </div>
            <div className={styles["input-container"]}>
              <Field
                id="email"
                name="email"
                placeholder=" "
                type="email"
                className={styles.input}
              />
              <div className={styles.cut}></div>
              <label htmlFor="email" className={styles.placeholder}>
                Email
              </label>
            </div>
            <div className={styles["checkbox-container"]}>
              <Field
                name="cgu"
                id="cgu"
                type="checkbox"
              />
              <label className={styles.checkbox} htmlFor="cgu">
                <span>
                  <svg width="12px" height="9px" viewBox="0 0 12 9">
                    <polyline points="1 5 4 8 11 1"></polyline>
                  </svg>
                </span>
                <span>
                  En cliquant sur "Démarrer le jeu" vous autorisez Ingeniance et
                  inpulse.tv à utliser votre image sur leur chaîne youtube.
                </span>
              </label>
            </div>
            <button type="submit" className={styles.submit}>
              Démarrer le jeu
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterFormular;
