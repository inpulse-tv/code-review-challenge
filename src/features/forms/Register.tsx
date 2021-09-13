import React, { useRef, useEffect, useCallback } from "react";
import {
  Formik,
  Field,
  Form,
  FormikHelpers,
  FormikProps,
  ErrorMessage,
} from "formik";
import * as Yup from "yup";
import styles from "./Register.module.scss";
import { IProps } from "./IProps";
import { IValues } from "./IValues";

/**
 * Register formular component.
 * @returns the formular.
 */
const RegisterFormular = (props: IProps) => {
  const formRef = useRef<FormikProps<IValues>>(null);

  /**
   * Handle key press event
   */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLFormElement> | KeyboardEvent) => {
      // Manage escape key.
      if (event.key === "Escape") {
        if (props.onEscapePress) props.onEscapePress();
      }
      // Manage return key out of formik component.
      if (event.key === "Enter") {
        formRef.current?.submitForm();
      }
    },
    [props]
  );

  useEffect(() => {
    document.addEventListener("keydown", (e) => onKeyDown(e), false);

    return () => {
      document.removeEventListener("keydown", (e) => onKeyDown(e), false);
    };
  }, [onKeyDown]);

  return (
    <div className={styles.container}>
      <h2>Veuillez vous enregistrer</h2>
      <Formik
        innerRef={formRef}
        initialValues={{
          name: "",
          email: "",
          cgu: false,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .min(3, "Trop cours !")
            .max(12, "Trop long !")
            .required("Requis !"),
          cgu: Yup.bool().oneOf(
            [true],
            "Veuillez accepter les conditions générales pour participer."
          ),
        })}
        onSubmit={(
          values: IValues,
          { setSubmitting }: FormikHelpers<IValues>
        ) => {
          setSubmitting(false);
          props.onSubmit(values);
        }}>
        {({ errors, touched, isSubmitting }) => (
          <Form
            className={styles.register}
            onKeyDown={(e) => {
              onKeyDown(e);
            }}>
            <div className={styles["input-container"]}>
              <Field
                id="name"
                name="name"
                placeholder=" "
                className={styles.input}
              />
              <div className={styles.cut}></div>
              <label htmlFor="name" className={styles.placeholder}>
                Nom{" "}
                {errors.name && touched.name
                  ? `... ${errors.name}`
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
              <ErrorMessage
                name="cgu"
                component="div"
                className={styles["invalid-feedback"]}
              />
            </div>
            <button
              type="submit"
              className={styles.submit}
              disabled={isSubmitting}>
              Démarrer le jeu
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterFormular;
