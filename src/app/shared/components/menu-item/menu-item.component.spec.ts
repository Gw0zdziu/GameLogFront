import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { MenuItemComponent } from './menu-item.component';

const mockItem = {
  label: 'Home',
  icon: faHome,
  routerLink: '/home',
};

const renderComponent = (item?: typeof mockItem) =>
  render(MenuItemComponent, {
    componentInputs: item ? { item } : {},
    providers: [provideRouter([])],
  });

describe('MenuItemComponent', () => {
  afterEach(() => jest.clearAllMocks());

  it('should create', async () => {
    const { fixture } = await renderComponent(mockItem);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('wyświetla etykietę elementu menu', async () => {
    await renderComponent(mockItem);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renderuje link z prawidłowym href', async () => {
    await renderComponent(mockItem);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/home');
  });

  it('link posiada klasę item-link', async () => {
    await renderComponent(mockItem);
    expect(screen.getByRole('link')).toHaveClass('item-link');
  });
});
