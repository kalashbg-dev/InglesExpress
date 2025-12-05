from playwright.sync_api import Page, expect, sync_playwright
import time

def verify_scroll_navigation(page: Page):
    # 1. Arrange: Go to the homepage.
    page.goto("http://localhost:3000")

    # 2. Check if Pricing section exists
    pricing_section = page.locator("#pricing")
    expect(pricing_section).to_be_visible()

    # 3. Check if Contact section exists
    contact_section = page.locator("#contact")
    expect(contact_section).to_be_visible()

    # 4. Click Pricing link in Main Nav (Desktop)
    # We might need to ensure window size is desktop
    page.set_viewport_size({"width": 1280, "height": 800})

    pricing_link = page.get_by_role("link", name="Precios").first
    # Note: 'first' because mobile nav might also be in DOM but hidden

    # Click
    pricing_link.click()

    # Wait a bit for scroll (though Playwright might not wait for scroll animation)
    time.sleep(1)

    # Check URL hash
    assert "#pricing" in page.url

    # Take screenshot of Pricing section
    page.screenshot(path="/home/jules/verification/pricing-scroll.png")

    # 5. Click Contact link
    contact_link = page.get_by_role("link", name="Contacto").first
    contact_link.click()

    time.sleep(1)

    assert "#contact" in page.url
    page.screenshot(path="/home/jules/verification/contact-scroll.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_scroll_navigation(page)
            print("Verification successful!")
        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="/home/jules/verification/failure.png")
        finally:
            browser.close()
