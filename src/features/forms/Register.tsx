import React from "react";
import { Formik, Field, Form, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./Register.module.scss";
import { IProps } from "./IProps";
import { IValues } from "./IValues";

/**
 * Register formular component.
 * @returns the formular.
 */
const RegisterFormular = (props: IProps) => {
  return (
    <div className={styles.container}>
      <h4>Veuillez vous enregistrer</h4>
      <Formik
        initialValues={{
          pseudo: "",
          email: "",
          cgu: false
        }}
        validationSchema={Yup.object().shape({
          pseudo: Yup.string()
            .min(3, "Trop cours !")
            .max(12, "Trop long !")
            .required("Requis !"),
          cgu: Yup.bool().oneOf([true], 'Veuillez accepter les conditions générales pour participer.')
        })}
        onSubmit={(
          values: IValues,
          { setSubmitting }: FormikHelpers<IValues>
        ) => {
          setSubmitting(false);
          props.onSubmit(values);
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
              <Field name="cgu" id="cgu" type="checkbox" />
              <label className={styles.checkbox} htmlFor="cgu">
                <span>
                  <svg width="12px" height="9px" viewBox="0 0 12 9">
                    <polyline points="1 5 4 8 11 1"></polyline>
                  </svg>
                </span>
                <span>
                  En cliquant sur "Démarrer le jeu" vous autorisez Ingeniance et
                  inpulse.tv à utiliser votre image sur leur chaîne youtube.
                </span>
              </label>
              <ErrorMessage name="cgu" component="div" className={styles["invalid-feedback"]} />
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
