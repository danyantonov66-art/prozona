// app/privacy/page.tsx
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Политика за поверителност
          </h1>
          <p className="text-gray-400">
            Актуализирано: {new Date().toLocaleDateString('bg-BG')}
          </p>
        </div>

        <div className="bg-[#1A1A2E] rounded-lg p-8 space-y-8">
          
          {/* 1. Администратор */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Администратор на лични данни</h2>
            <div className="text-gray-300 space-y-2">
              <p>Администратор на личните данни е:</p>
              <p className="font-semibold">„Констант“ 2003 ООД</p>
              <p>ЕИК: 208363639</p>
              <p>Адрес на управление: [впишете адрес]</p>
              <p>Имейл за контакт: office@prozona.bg</p>
              <p>Телефон: +359 883 202 922</p>
              <p className="mt-2">Наричано по-долу „Администратор“ или „ProZona“.</p>
            </div>
          </section>

          {/* 2. Какви лични данни събираме */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Какви лични данни събираме</h2>
            <div className="text-gray-300 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.1. При регистрация:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Име и фамилия</li>
                  <li>Фирма (ако е приложимо)</li>
                  <li>Имейл адрес</li>
                  <li>Телефон (ако се предоставя)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.2. При използване на платформата:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Профилна информация</li>
                  <li>Съдържание на публикувани обяви</li>
                  <li>Съобщения между потребители</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">2.3. Автоматично събирани данни:</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>IP адрес</li>
                  <li>Данни за устройството</li>
                  <li>Логове за достъп</li>
                  <li>Данни чрез бисквитки</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Цели на обработването */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Цели на обработването</h2>
            <ul className="list-disc list-inside ml-4 text-gray-300 space-y-1">
              <li>Създаване и поддържане на потребителски профил</li>
              <li>Осигуряване функционирането на платформата</li>
              <li>Свързване между клиенти и специалисти</li>
              <li>Администриране на плащания</li>
              <li>Подобряване на услугите</li>
              <li>Изпълнение на законови задължения</li>
            </ul>
          </section>

          {/* 4. Правно основание */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Правно основание за обработване</h2>
            <ul className="list-disc list-inside ml-4 text-gray-300 space-y-1">
              <li>чл. 6, ал. 1, б. „б“ от GDPR – изпълнение на договор</li>
              <li>чл. 6, ал. 1, б. „в“ – законово задължение</li>
              <li>чл. 6, ал. 1, б. „е“ – легитимен интерес</li>
              <li>чл. 6, ал. 1, б. „а“ – съгласие (при маркетингови съобщения)</li>
            </ul>
          </section>

          {/* 5. Срок за съхранение */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Срок за съхранение</h2>
            <ul className="list-disc list-inside ml-4 text-gray-300 space-y-1">
              <li>Докато профилът е активен</li>
              <li>До изрично искане за изтриване</li>
              <li>Съгласно законовите срокове (напр. счетоводни документи – 5 години)</li>
            </ul>
          </section>

          {/* 6. Получатели на данни */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Получатели на лични данни</h2>
            <ul className="list-disc list-inside ml-4 text-gray-300 space-y-1">
              <li>Хостинг доставчици</li>
              <li>IT подизпълнители</li>
              <li>Платежни оператори</li>
              <li>Държавни органи при законово основание</li>
            </ul>
            <p className="text-gray-300 mt-2">Администраторът не продава лични данни на трети лица.</p>
          </section>

          {/* 7. Трансфер извън ЕС */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Трансфер извън ЕС</h2>
            <p className="text-gray-300">
              При използване на услуги извън ЕС, това се извършва при наличие на решение за адекватност, стандартни договорни клаузи или други законови механизми по GDPR.
            </p>
          </section>

          {/* 8. Права на потребителите */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Права на субектите на данни</h2>
            <ul className="list-disc list-inside ml-4 text-gray-300 space-y-1">
              <li>Достъп до личните си данни</li>
              <li>Коригиране на неточни данни</li>
              <li>Изтриване („право да бъдеш забравен“)</li>
              <li>Ограничаване на обработването</li>
              <li>Преносимост на данните</li>
              <li>Възражение срещу обработване</li>
              <li>Оттегляне на съгласие</li>
            </ul>
            <p className="text-gray-300 mt-2">Искания се подават на: office@prozona.bg</p>
          </section>

          {/* 9. Право на жалба */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Право на жалба</h2>
            <div className="text-gray-300">
              <p>Комисия за защита на личните данни (КЗЛД)</p>
              <p>гр. София 1592</p>
              <p>бул. „Проф. Цветан Лазаров“ № 2</p>
              <p>www.cpdp.bg</p>
            </div>
          </section>

          {/* 10. Мерки за сигурност */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Мерки за сигурност</h2>
            <ul className="list-disc list-inside ml-4 text-gray-300 space-y-1">
              <li>SSL криптиране</li>
              <li>Ограничен достъп до данни</li>
              <li>Защитени сървъри</li>
              <li>Регулярен мониторинг</li>
            </ul>
          </section>

          {/* 11. Бисквитки */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Бисквитки (Cookies)</h2>
            <p className="text-gray-300">
              Платформата използва бисквитки за функционалност, анализ на трафик и подобряване на потребителското изживяване. 
              Подробности са описани в <Link href="/cookies" className="text-[#1DB954] hover:underline">Политиката за бисквитки</Link>.
            </p>
          </section>

          {/* 12. Промени */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Промени в политиката</h2>
            <p className="text-gray-300">
              Администраторът си запазва правото да актуализира настоящата политика. Промените се публикуват на сайта.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}