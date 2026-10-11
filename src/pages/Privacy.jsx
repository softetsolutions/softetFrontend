import { Navbar } from "../components/Navbar";

const Privacy = () => {
  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <Navbar showoptions={false} />

      {/* Main Privacy Policy content */}
      <div className="min-h-screen bg-blue-50 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-6">
            Privacy Policy
          </h1>

          <div className="text-gray-700 leading-relaxed space-y-6">
            <p>
              Introduction: This Privacy Policy describes how Softet Solutions
              and its affiliates (collectively &quot;Softet Solutions, we, our,
              us&quot;) collect, use, share, protect, or otherwise process your
              information/personal data through our website
              <a
                href="https://www.softetsolutions.com/"
                className="text-blue-600 underline"
              >
                {" "}
                https://www.softetsolutions.com/
              </a>{" "}
              and our mobile application Reportet (together, the
              &quot;Platform&quot;). Please note that you may browse certain
              sections of the website without registering. We do not offer any
              product/service outside India, and your personal data will
              primarily be stored and processed in India. By visiting this
              Platform, providing your information, or availing any
              product/service offered on the Platform (including the Reportet
              mobile app), you agree to be bound by this Privacy Policy, the
              Terms of Use, applicable service/product terms, and the laws of
              India. If you do not agree, please do not use the Platform.
            </p>

            <ol className="list-decimal list-inside space-y-4">
              <li>
                <strong>Collection:</strong> We collect personal data when you
                use our Platform, services, or interact with us. This includes
                information provided during registration such as name, date of
                birth, address, phone number, email, and sensitive data like
                bank account or payment information, with your consent. Through
                the Reportet mobile app, we may also collect device and usage
                information needed to operate the app (for example account and
                session identifiers). You may opt not to provide certain
                information by choosing not to use specific features. We may
                also track behavior, preferences, and transaction information,
                including third-party partner data (governed by their privacy
                policies). Never share sensitive data like PINs or passwords via
                email or call.
              </li>

              <li>
                <strong>Location data (Reportet mobile app):</strong> The
                Reportet mobile app collects precise location data (including
                GPS coordinates, and where available accuracy, speed, heading,
                activity state, and related timestamps) to enable field day
                tracking and live location sharing with your organization.{" "}
                <strong>
                  This app collects location data to enable field day tracking
                  and live location sharing with your organization even when the
                  app is closed or not in use.
                </strong>{" "}
                Location is collected only after you grant permission on your
                device and start a tracking session (for example by tapping
                &quot;Start Day&quot;). While a session is active, location may
                continue to be collected in the background (including via a
                foreground/notification service on Android) so tracking can
                continue while you work with other apps. Location pings and
                session start/end points are sent to our servers and made
                available to authorized users in your organization (such as
                administrators or managers) for workforce and field operations
                purposes. We do not sell location data, and we do not use
                location data for advertising or unrelated marketing. You can
                stop collection at any time by ending your day in the app
                and/or revoking location permission in your device settings;
                without location permission, field tracking features will not
                work.
              </li>

              <li>
                <strong>Usage:</strong> We use personal data to provide
                services, assist organizations and partners, enhance customer
                experience, resolve disputes, inform about offers, customize
                experiences, detect fraud, enforce terms, conduct research, and
                other purposes specified during collection. Location data is
                used solely for the field tracking and organizational visibility
                purposes described above. Access to certain services may depend
                on providing permission.
              </li>

              <li>
                <strong>Sharing:</strong> Personal data may be shared internally
                within our group or with third parties such as service
                providers, payment issuers, and government agencies if required
                by law or for fraud prevention. Location and tracking data from
                the Reportet mobile app are shared with your organization&apos;s
                authorized personnel so they can view live and historical field
                activity for employees who have started tracking. Third-party
                disclosures are necessary to provide services or comply with
                legal obligations.
              </li>

              <li>
                <strong>Security Precautions:</strong> We adopt reasonable
                practices to protect your data against unauthorized access,
                loss, or misuse. While we use secure servers, transmission over
                the internet may not be completely secure. Users are responsible
                for protecting login credentials.
              </li>

              <li>
                <strong>Data Deletion and Retention:</strong> You can delete
                your account via profile settings or by contacting us. Some data
                may be retained in cases of pending grievances, shipments, or
                legal requirements. Location and tracking records may be retained
                for as long as needed for your organization&apos;s operational,
                compliance, or legal purposes, after which they may be deleted or
                anonymized. Personal data is retained only as long as necessary
                and may be anonymized for research/analytics.
              </li>

              <li>
                <strong>Your Rights:</strong> You may access, rectify, and
                update your personal data through Platform functionalities. For
                location specifically, you may stop sharing via the app or your
                device permission settings, and you may contact us regarding
                access or deletion requests.
              </li>

              <li>
                <strong>Consent:</strong> By using the Platform, you consent to
                collection, use, storage, disclosure, and processing of
                information as described. Location collection in the Reportet
                mobile app additionally requires your device permission and an
                affirmative action to start tracking. You may withdraw consent by
                ending tracking, changing device permissions, or contacting the
                Grievance Officer, but withdrawal may affect service
                availability (including field tracking).
              </li>

              <li>
                <strong>Changes to this Privacy Policy:</strong> Check the
                Privacy Policy periodically for updates. Significant changes may
                be communicated per applicable laws.
              </li>

              <li>
                <strong>Grievance Officer:</strong> Akash Tripathi, CEO, Softet
                Solutions, support@softetsolutions.com, Time: Monday - Friday
                (9:00 - 18:00)
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
