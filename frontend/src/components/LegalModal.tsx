import { useT } from '../i18n'

type DocType = 'privacy' | 'terms'

export default function LegalModal({
  type,
  onClose,
}: {
  type: DocType
  onClose: () => void
}) {
  const { t } = useT()
  const isPrivacy = type === 'privacy'

  return (
    <div
      className="fixed inset-0 z-[95] flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-2xl bg-background shadow-[0_-12px_60px_rgba(60,40,20,0.18)] sm:max-w-[520px] sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2 className="font-serif text-xl text-foreground">
            {isPrivacy ? t('Политика конфиденциальности') : t('Условия использования')}
          </h2>
          <button
            onClick={onClose}
            aria-label={t('Закрыть')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 text-sm leading-relaxed text-secondary-foreground">
          {isPrivacy ? <PrivacyContent /> : <TermsContent />}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="w-full rounded-2xl bg-primary py-3.5 font-medium text-primary-foreground transition active:scale-[0.98]"
          >
            {t('Понятно')}
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      {children}
    </section>
  )
}

function PrivacyContent() {
  return (
    <>
      <p className="mb-4 text-muted-foreground">
        Дата вступления в силу: 1 января 2026 г.
      </p>

      <Section title="1. Какие данные мы собираем">
        <p>Мы собираем следующие категории персональных данных:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Контактные данные: имя, фамилия, номер телефона, адрес электронной почты.</li>
          <li>Данные профиля: фотография, специализация (при поиске работы), резюме.</li>
          <li>Данные бизнеса: название, категория, адрес, перечень услуг.</li>
          <li>Данные об использовании: IP-адрес, тип устройства, действия в приложении.</li>
        </ul>
      </Section>

      <Section title="2. Цели обработки данных">
        <ul className="list-disc space-y-1 pl-5">
          <li>Предоставление и поддержка сервиса SalemBeauty.</li>
          <li>Обработка записей и транзакций.</li>
          <li>Персонализация рекомендаций и бонусной программы.</li>
          <li>Обеспечение безопасности и предотвращение мошенничества.</li>
          <li>Улучшение качества сервиса и аналитика использования.</li>
        </ul>
      </Section>

      <Section title="3. Хранение и защита данных">
        <p>
          Все персональные данные хранятся на защищённых серверах с использованием шифрования.
          Доступ к данным имеют только авторизованные сотрудники. Мы используем стандартные
          меры безопасности, включая SSL/TLS шифрование и хеширование паролей.
        </p>
      </Section>

      <Section title="4. Передача данных третьим лицам">
        <p>
          Мы не продаём ваши персональные данные третьим лицам. Данные могут быть переданы
          только партнёрам-салонам для выполнения записей и поставщикам платёжных услуг для
          проведения транзакций.
        </p>
      </Section>

      <Section title="5. Ваши права">
        <ul className="list-disc space-y-1 pl-5">
          <li>Доступ к своим персональным данным.</li>
          <li>Исправление неточных данных.</li>
          <li>Удаление аккаунта и связанных данных.</li>
          <li>Отзыв согласия на обработку данных.</li>
        </ul>
      </Section>

      <Section title="6. Контакты">
        <p>
          По вопросам обработки данных обращайтесь: <span className="font-medium text-primary">privacy@salembeauty.kz</span>
        </p>
      </Section>
    </>
  )
}

function TermsContent() {
  return (
    <>
      <p className="mb-4 text-muted-foreground">
        Дата вступления в силу: 1 января 2026 г.
      </p>

      <Section title="1. Общие положения">
        <p>
          Настоящие Условия использования регулируют отношения между пользователем и платформой
          SalemBeauty. Регистрируясь в приложении, вы принимаете эти условия в полном объёме.
        </p>
      </Section>

      <Section title="2. Регистрация и аккаунт">
        <ul className="list-disc space-y-1 pl-5">
          <li>Для использования сервиса необходимо зарегистрировать аккаунт.</li>
          <li>Вы обязуетесь предоставить достоверную информацию.</li>
          <li>Вы несёте ответственность за безопасность своего аккаунта и пароля.</li>
          <li>Один пользователь может иметь один аккаунт.</li>
        </ul>
      </Section>

      <Section title="3. Запись на услуги">
        <p>
          Запись к мастеру или в салон является подтверждением вашего намерения. При неявке
          без предварительной отмены салон вправе удержать депозит (если он предусмотрен).
        </p>
      </Section>

      <Section title="4. Бонусная программа">
        <ul className="list-disc space-y-1 pl-5">
          <li>Бонусы начисляются за выполненные записи и покупки.</li>
          <li>Бонусы не являются денежными средствами и не подлежат обмену на деньги.</li>
          <li>SalemBeauty оставляет за собой право изменять условия программы.</li>
        </ul>
      </Section>

      <Section title="5. Для бизнес-партнёров">
        <p>
          Бизнес-аккаунты несут ответственность за достоверность информации об услугах и ценах.
          SalemBeauty является агрегатором и не несёт ответственности за качество услуг,
          предоставляемых салонами и мастерами.
        </p>
      </Section>

      <Section title="6. Ограничение ответственности">
        <p>
          SalemBeauty предоставляется «как есть». Мы стремимся обеспечить бесперебойную работу,
          но не гарантируем отсутствие ошибок или непрерывность сервиса. Максимальная
          ответственность ограничена суммой оплаченных услуг.
        </p>
      </Section>

      <Section title="7. Изменения условий">
        <p>
          Мы можем обновлять данные Условия. При существенных изменениях мы уведомим вас
          через приложение. Продолжение использования сервиса означает согласие с обновлёнными
          условиями.
        </p>
      </Section>

      <Section title="8. Контакты">
        <p>
          По всем вопросам: <span className="font-medium text-primary">support@salembeauty.kz</span>
        </p>
      </Section>
    </>
  )
}
