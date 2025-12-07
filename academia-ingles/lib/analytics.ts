// Event tracking utilities
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...params,
    })
  }

  // También enviar a Sentry como breadcrumb
  if (typeof window !== 'undefined' && (window as any).Sentry) {
    (window as any).Sentry.addBreadcrumb({
      category: 'analytics',
      message: `${category}: ${action}`,
      level: 'info',
      data: { label, value, ...params },
    })
  }
}

// Eventos predefinidos
export const AnalyticsEvents = {
  // User interactions
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  LINK_CLICK: 'link_click',

  // Page interactions
  PAGE_VIEW: 'page_view',
  SCROLL_DEPTH: 'scroll_depth',
  TIME_ON_PAGE: 'time_on_page',

  // Business events
  SIGNUP_START: 'signup_start',
  SIGNUP_COMPLETE: 'signup_complete',
  PAYMENT_START: 'payment_start',
  PAYMENT_COMPLETE: 'payment_complete',
  CONTACT_FORM: 'contact_form',

  // Error events
  ERROR_OCCURRED: 'error_occurred',
  NOT_FOUND: 'page_not_found',
}

// Track conversion (Stripe, etc.)
export const trackConversion = (
  conversionId: string,
  conversionLabel: string,
  value: number = 1.0,
  currency: string = 'USD'
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}/${conversionId}/${conversionLabel}`,
      value: value,
      currency: currency,
      transaction_id: `txn_${Date.now()}`,
    })
  }
}

// Track exceptions
export const trackError = (error: Error, context?: Record<string, any>) => {
  trackEvent(
    AnalyticsEvents.ERROR_OCCURRED,
    'errors',
    error.message,
    undefined,
    { error: error.name, stack: error.stack, ...context }
  )
}
