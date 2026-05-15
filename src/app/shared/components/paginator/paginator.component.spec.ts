import {fireEvent, render, screen} from '@testing-library/angular';
import {PaginatorComponent} from './paginator.component';
import {PaginationConfig} from '../../models/pagination-config';

type Setup = {
  component: PaginatorComponent;
  pageNumberChange: jest.Mock<any, any, any>;
  pageSizeChange: jest.Mock<any, any, any>;
}

describe('PaginatorComponent', () => {
  const defaultPageSizes = [10, 25, 50];

  function makeConfig(overrides: Partial<PaginationConfig> = {}): PaginationConfig {
    return { pageNumber: 1, pageSize: 10, amountPagesList: [1, 2, 3, 4, 5], ...overrides };
  }

  async function setup(config: PaginationConfig, sizes = defaultPageSizes): Promise<Setup> {
    const { fixture } = await render(PaginatorComponent, {
      componentInputs: { paginationConfig: config, pageSizes: sizes },
    });
    const component = fixture.componentInstance;
    const pageNumberChange = jest.fn();
    const pageSizeChange = jest.fn();
    component.pageNumberChange.subscribe(pageNumberChange);
    component.pageSizeChange.subscribe(pageSizeChange);
    return { component, pageNumberChange, pageSizeChange };
  }

  afterEach(() => jest.clearAllMocks());

  describe('pagination computed', () => {
    it('returns single page when amountPagesList has one entry', async () => {
      const { component } = await setup(makeConfig({ amountPagesList: [1] }));
      expect(component.pagination()).toEqual([1]);
    });

    it('returns first two pages when on page 1', async () => {
      const { component } = await setup(makeConfig({ pageNumber: 1 }));
      expect(component.pagination()).toEqual([1, 2]);
    });

    it('returns last two pages when on last page', async () => {
      const { component } = await setup(makeConfig({ pageNumber: 5 }));
      expect(component.pagination()).toEqual([4, 5]);
    });

    it('returns [prev, current, next] when on a middle page', async () => {
      const { component } = await setup(makeConfig({ pageNumber: 3 }));
      expect(component.pagination()).toEqual([2, 3, 4]);
    });
  });

  describe('selectPreviousPage()', () => {
    it('emits pageNumberChange with pageNumber - 1', async () => {
      const { component, pageNumberChange } = await setup(makeConfig({ pageNumber: 3 }));
      component.selectPreviousPage();
      expect(pageNumberChange).toHaveBeenCalledWith(2);
    });

    it('does not emit when already on first page', async () => {
      const { component, pageNumberChange } = await setup(makeConfig({ pageNumber: 1 }));
      component.selectPreviousPage();
      expect(pageNumberChange).not.toHaveBeenCalled();
    });
  });

  describe('selectNextPage()', () => {
    it('emits pageNumberChange with pageNumber + 1', async () => {
      const { component, pageNumberChange } = await setup(makeConfig({ pageNumber: 2 }));
      component.selectNextPage();
      expect(pageNumberChange).toHaveBeenCalledWith(3);
    });

    it('does not emit when already on last page', async () => {
      const { component, pageNumberChange } = await setup(makeConfig({ pageNumber: 5 }));
      component.selectNextPage();
      expect(pageNumberChange).not.toHaveBeenCalled();
    });
  });

  describe('selectFirstPage()', () => {
    it('emits pageNumberChange with first page number', async () => {
      const { component, pageNumberChange } = await setup(makeConfig({ pageNumber: 4 }));
      component.selectFirstPage();
      expect(pageNumberChange).toHaveBeenCalledWith(1);
    });
  });

  describe('selectLastPage()', () => {
    it('emits pageNumberChange with last page number', async () => {
      const { component, pageNumberChange } = await setup(makeConfig({ pageNumber: 1 }));
      component.selectLastPage();
      expect(pageNumberChange).toHaveBeenCalledWith(5);
    });
  });

  describe('selectPage()', () => {
    it('emits pageNumberChange with the value from the event', async () => {
      const { component, pageNumberChange } = await setup(makeConfig());
      const event = { target: { value: '3' } } as unknown as Event;
      component.selectPage(event);
      expect(pageNumberChange).toHaveBeenCalledWith(3);
    });
  });

  describe('selectPageSize()', () => {
    it('emits pageSizeChange with the selected size', async () => {
      const { component, pageSizeChange } = await setup(makeConfig());
      const event = { target: { value: '25' } } as unknown as Event;
      component.selectPageSize(event);
      expect(pageSizeChange).toHaveBeenCalledWith(25);
    });

    it('resets pageNumber to 1 on the config object', async () => {
      const config = makeConfig({ pageNumber: 4 });
      const { component } = await setup(config);
      const event = { target: { value: '25' } } as unknown as Event;
      component.selectPageSize(event);
      expect(config.pageNumber).toBe(1);
    });
  });

  describe('button disabled states', () => {
    it('disables first-page and previous buttons when on page 1', async () => {
      await setup(makeConfig({ pageNumber: 1 }));
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toBeDisabled();
      expect(buttons[1]).toBeDisabled();
    });

    it('disables next and last-page buttons when on last page', async () => {
      await setup(makeConfig({ pageNumber: 5 }));
      const buttons = screen.getAllByRole('button');
      expect(buttons[2]).toBeDisabled();
      expect(buttons[3]).toBeDisabled();
    });

    it('enables all navigation buttons when on a middle page', async () => {
      await setup(makeConfig({ pageNumber: 3 }));
      screen.getAllByRole('button').forEach(btn => expect(btn).not.toBeDisabled());
    });
  });

  describe('template interactions', () => {
    it('emits pageNumberChange via first-page button click', async () => {
      const { pageNumberChange } = await setup(makeConfig({ pageNumber: 3 }));
      const [firstBtn] = screen.getAllByRole('button');
      fireEvent.click(firstBtn);
      expect(pageNumberChange).toHaveBeenCalledWith(1);
    });

    it('emits pageNumberChange via prev-page button click', async () => {
      const { pageNumberChange } = await setup(makeConfig({ pageNumber: 3 }));
      const [, prevBtn] = screen.getAllByRole('button');
      fireEvent.click(prevBtn);
      expect(pageNumberChange).toHaveBeenCalledWith(2);
    });

    it('emits pageNumberChange via next-page button click', async () => {
      const { pageNumberChange } = await setup(makeConfig({ pageNumber: 3 }));
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[2]);
      expect(pageNumberChange).toHaveBeenCalledWith(4);
    });

    it('emits pageNumberChange via last-page button click', async () => {
      const { pageNumberChange } = await setup(makeConfig({ pageNumber: 3 }));
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[3]);
      expect(pageNumberChange).toHaveBeenCalledWith(5);
    });

    it('renders visible page labels for current page window', async () => {
      await setup(makeConfig({ pageNumber: 3 }));
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('renders all page size options in the select', async () => {
      await setup(makeConfig(), [10, 25, 50]);
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.options).toHaveLength(3);
      expect(select.options[0].value).toBe('10');
      expect(select.options[1].value).toBe('25');
      expect(select.options[2].value).toBe('50');
    });

    it('emits pageSizeChange when select value changes', async () => {
      const { pageSizeChange } = await setup(makeConfig());
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '25' } });
      expect(pageSizeChange).toHaveBeenCalledWith(25);
    });
  });
});
