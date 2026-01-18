'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { InvoiceBuilderData, CustomField } from '../types/invoice-builder.types';
import { calculateInvoiceTotals, formatCurrency, amountToWords } from '../utils/invoiceCalculations';
import invoiceTemplates from '../constants/invoiceTemplates';

interface InvoiceInlineEditorProps {
  data: InvoiceBuilderData;
  onUpdate: (updates: Partial<InvoiceBuilderData>) => void;
}

export default function InvoiceInlineEditor({ data, onUpdate }: InvoiceInlineEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isTitleDropdownOpen, setIsTitleDropdownOpen] = useState(false);
  const [isTitleTyping, setIsTitleTyping] = useState(false);
  const [isCustomFieldModalOpen, setIsCustomFieldModalOpen] = useState(false);
  const [customFieldLabel, setCustomFieldLabel] = useState('');
  const [customFieldValue, setCustomFieldValue] = useState('');
  const [customFieldDefault, setCustomFieldDefault] = useState(false);
  const [openCalendar, setOpenCalendar] = useState<string | null>(null);
  const [showDueDate, setShowDueDate] = useState(true); // Show due date by default
  const [isBusinessDetailsModalOpen, setIsBusinessDetailsModalOpen] = useState(false);
  const [isClientDetailsModalOpen, setIsClientDetailsModalOpen] = useState(false);
  const [expandedBusinessSections, setExpandedBusinessSections] = useState({
    basicInfo: true,
    taxInfo: false,
    address: false,
    additionalDetails: false,
  });
  const [expandedClientSections, setExpandedClientSections] = useState({
    basicInfo: true,
    taxInfo: false,
    address: false,
    additionalDetails: false,
  });
  const [updatePreference, setUpdatePreference] = useState<'future' | 'all'>('future');
  const dateInputRefs = {
    issueDate: useRef<HTMLInputElement>(null),
    validTillDate: useRef<HTMLInputElement>(null),
  };
  const selectedTemplate = invoiceTemplates.find((t) => t.id === data.template) || invoiceTemplates[0];
  const totals = calculateInvoiceTotals(data.items, data.taxRate, data.discount);
  const isTaxInvoice = data.invoiceType === 'tax';

  const documentTitleSuggestions = ['Invoice', 'Quotation', 'Estimate', 'Retail Invoice', 'Debit Note'];

  // Filter suggestions: if typing manually, show all; otherwise exclude current selection
  const filteredSuggestions = isTitleTyping
    ? documentTitleSuggestions
    : documentTitleSuggestions.filter((suggestion) => suggestion !== data.documentTitle);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          business: {
            ...data.business,
            logo: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const openCustomFieldModal = () => {
    setCustomFieldLabel('');
    setCustomFieldValue('');
    setCustomFieldDefault(false);
    setIsCustomFieldModalOpen(true);
  };

  const closeCustomFieldModal = () => {
    setIsCustomFieldModalOpen(false);
    setCustomFieldLabel('');
    setCustomFieldValue('');
    setCustomFieldDefault(false);
  };

  const saveCustomField = () => {
    if (!customFieldLabel.trim()) {
      alert('Label is required');
      return;
    }
    const newField: CustomField = {
      id: Date.now().toString(),
      label: customFieldLabel.trim(),
      value: customFieldValue.trim(),
    };
    onUpdate({
      customFields: [...(data.customFields || []), newField],
    });
    closeCustomFieldModal();
  };

  const updateCustomField = (id: string, updates: Partial<CustomField>) => {
    onUpdate({
      customFields: (data.customFields || []).map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    });
  };

  const removeCustomField = (id: string) => {
    onUpdate({
      customFields: (data.customFields || []).filter((field) => field.id !== id),
    });
  };

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      description: '',
      hsnSac: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: isTaxInvoice ? 18 : 0,
      discount: 0,
    };
    onUpdate({ items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    onUpdate({ items: data.items.filter((item) => item.id !== id) });
  };

  const updateItem = (id: string, updates: Partial<InvoiceBuilderData['items'][0]>) => {
    onUpdate({
      items: data.items.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF download feature coming soon!');
  };

  // Update due date when invoice date changes (always invoice date + 15 days)
  const prevIssueDateRef = useRef<string>(data.issueDate);
  useEffect(() => {
    if (data.issueDate && data.issueDate !== prevIssueDateRef.current) {
      prevIssueDateRef.current = data.issueDate;
      const issueDate = new Date(data.issueDate);
      const calculatedDueDate = new Date(issueDate);
      calculatedDueDate.setDate(calculatedDueDate.getDate() + 15);
      const expectedDueDate = calculatedDueDate.toISOString().split('T')[0];
      onUpdate({ validTillDate: expectedDueDate });
    }
  }, [data.issueDate]);

  // Handle clicking outside to close dropdown and calendar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        titleInputRef.current &&
        !titleInputRef.current.contains(event.target as Node)
      ) {
        setIsTitleDropdownOpen(false);
        setIsTitleTyping(false);
      }
      // Close calendar when clicking outside
      if (openCalendar && !(event.target as HTMLElement).closest('.calendar-container')) {
        setOpenCalendar(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openCalendar]);

  const handleTitleChange = (value: string) => {
    onUpdate({ documentTitle: value });
    setIsTitleTyping(true);
    setIsTitleDropdownOpen(true);
  };

  const handleTitleFocus = () => {
    setIsTitleDropdownOpen(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onUpdate({ documentTitle: suggestion });
    setIsTitleDropdownOpen(false);
    setIsTitleTyping(false);
  };

  const handleEditButtonClick = () => {
    setIsTitleDropdownOpen(!isTitleDropdownOpen);
    setIsTitleTyping(false);
    titleInputRef.current?.focus();
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    // Parse the date string directly to avoid timezone issues
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleDateInputClick = (fieldName: 'issueDate' | 'validTillDate') => {
    setOpenCalendar(fieldName);
  };

  const handleDateSelect = (date: Date, fieldName: 'issueDate' | 'validTillDate') => {
    // Manually construct ISO date string to avoid timezone conversion issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    if (fieldName === 'issueDate') {
      onUpdate({ issueDate: dateString });
    } else {
      onUpdate({ validTillDate: dateString });
    }
    setOpenCalendar(null);
  };

  // Custom Calendar Component
  const CustomCalendar = ({ fieldName, currentDate, minDate }: { fieldName: 'issueDate' | 'validTillDate'; currentDate: string; minDate?: string }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(currentDate || Date.now()));
    const selectedDate = currentDate ? new Date(currentDate) : null;
    const today = new Date();
    const minimumDate = minDate ? new Date(minDate) : null;

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      // Previous month days
      const prevMonth = new Date(year, month - 1, 0);
      for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        days.push({ date: prevMonth.getDate() - i, isCurrentMonth: false, fullDate: new Date(year, month - 1, prevMonth.getDate() - i) });
      }
      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
        days.push({ date: i, isCurrentMonth: true, fullDate: new Date(year, month, i) });
      }
      // Next month days to fill the grid
      const remainingDays = 42 - days.length;
      for (let i = 1; i <= remainingDays; i++) {
        days.push({ date: i, isCurrentMonth: false, fullDate: new Date(year, month + 1, i) });
      }
      return days;
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
      setCurrentMonth((prev) => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
        return newDate;
      });
    };

    const days = getDaysInMonth(currentMonth);
    const isSameDay = (date1: Date, date2: Date) => {
      return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
    };

    const isBeforeMinDate = (date: Date) => {
      if (!minimumDate) return false;
      // Set time to midnight for both dates for accurate comparison
      const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const minDateOnly = new Date(minimumDate.getFullYear(), minimumDate.getMonth(), minimumDate.getDate());
      return dateOnly < minDateOnly;
    };

    return (
      <div
        className="calendar-container"
        style={{
          position: 'absolute',
          top: '100%',
          left: '0',
          marginTop: '4px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          padding: '1rem',
          zIndex: 2000,
          minWidth: '280px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Calendar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button
            type="button"
            onClick={() => navigateMonth('prev')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#111827' }}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button
            type="button"
            onClick={() => navigateMonth('next')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Day Names */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {dayNames.map((day) => (
            <div key={day} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', padding: '0.5rem' }}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
          {days.map((day, index) => {
            const isSelected = selectedDate && isSameDay(day.fullDate, selectedDate);
            const isToday = isSameDay(day.fullDate, today);
            const isOtherMonth = !day.isCurrentMonth;
            const isDisabled = isBeforeMinDate(day.fullDate);

            return (
              <button
                key={index}
                type="button"
                onClick={() => !isDisabled && handleDateSelect(day.fullDate, fieldName)}
                disabled={isDisabled}
                style={{
                  background: isSelected ? '#8B5CF6' : isToday ? 'transparent' : 'transparent',
                  border: isToday && !isSelected ? '1px solid #8B5CF6' : 'none',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  color: isDisabled ? '#E5E7EB' : isSelected ? 'white' : isOtherMonth ? '#D1D5DB' : '#374151',
                  fontWeight: isSelected || isToday ? 600 : 400,
                  transition: 'all 0.2s',
                  opacity: isDisabled ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected && !isDisabled) {
                    e.currentTarget.style.background = '#F3F4F6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected && !isDisabled) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {day.date}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const setInvoiceType = (invoiceType: InvoiceBuilderData['invoiceType']) => {
    const nextCurrency = invoiceType === 'tax' ? 'INR' : data.currency || 'USD';

    // When switching to tax invoices, default GST rate to 18% if currently 0
    // so the preview/table looks immediately correct.
    const nextItems =
      invoiceType === 'tax'
        ? data.items.map((it) => ({
          ...it,
          taxRate: it.taxRate || 18,
          hsnSac: it.hsnSac ?? '',
        }))
        : data.items.map((it) => ({
          ...it,
          taxRate: 0,
        }));

    onUpdate({ invoiceType, currency: nextCurrency, items: nextItems });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      {/* Header with Progress Steps */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#111827' }}>
          Create New {data.documentTitle}
        </h1>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div
            style={{
              padding: '0.5rem 1rem',
              background: '#8B5CF6',
              color: 'white',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            {data.documentTitle} Details
          </div>
          <div
            style={{
              padding: '0.5rem 1rem',
              background: '#F3F4F6',
              color: '#6B7280',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            Design & Share (optional)
          </div>
        </div>
      </div>

      {/* Invoice Type Selection */}
      <div style={{ marginBottom: '2rem', background: 'white', borderRadius: '12px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: '#374151', fontSize: '1rem' }}>
          Invoice Type
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setInvoiceType('tax')}
            style={{
              padding: '0.75rem',
              border: data.invoiceType === 'tax' ? '2px solid #8B5CF6' : '2px solid #E5E7EB',
              borderRadius: '8px',
              background: data.invoiceType === 'tax' ? '#F5F3FF' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>Tax Invoice</div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>GST fields + CGST/SGST breakdown</div>
          </button>

          <button
            type="button"
            onClick={() => setInvoiceType('non_tax')}
            style={{
              padding: '0.75rem',
              border: data.invoiceType === 'non_tax' ? '2px solid #8B5CF6' : '2px solid #E5E7EB',
              borderRadius: '8px',
              background: data.invoiceType === 'non_tax' ? '#F5F3FF' : 'white',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>Non‑Tax Invoice</div>
            <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>Basic details only (name/phone/email)</div>
          </button>
        </div>
      </div>

      {/* Main Document Editor */}
      <div
        id="invoice-preview"
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          position: 'relative',
        }}
      >
        {/* Top Section: Centered Title */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <input
              ref={titleInputRef}
              type="text"
              value={data.documentTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              onFocus={handleTitleFocus}
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                border: 'none',
                borderBottom: '2px dashed #D1D5DB',
                padding: '0.25rem 0',
                background: 'transparent',
                color: selectedTemplate.colors.primary,
                outline: 'none',
                textAlign: 'center',
                minWidth: '150px',
              }}
              placeholder="Invoice"
            />
            <button
              type="button"
              onClick={handleEditButtonClick}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: '#9CA3AF',
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>

          {/* Dropdown Suggestions */}
          {isTitleDropdownOpen && filteredSuggestions.length > 0 && (
            <div
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '300px',
                maxHeight: '200px',
                overflowY: 'auto',
                marginTop: '0.25rem',
              }}
            >
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    background: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    color: '#374151',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F9FAFB';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#8B5CF6',
              fontSize: '0.875rem',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            Add Subtitle
          </button>
        </div>

        {/* Document Details and Logo Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
          {/* Left: Document Details */}
          <div style={{ maxWidth: '500px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Invoice No */}
              <div>
                <label style={{
                  display: 'inline-block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.25rem',
                  borderBottom: '2px dashed #D1D5DB',
                  paddingBottom: '0.125rem',
                }}>
                  {data.documentTitle} No<span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => onUpdate({ invoiceNumber: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0',
                    border: 'none',
                    borderBottom: '1px solid #E5E7EB',
                    background: 'transparent',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    marginTop: '0.25rem',
                  }}
                  placeholder="A001"
                />
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: '0.125rem' }}>
                  Last No: {data.invoiceNumber || 'A001'} ({new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                </div>
              </div>

              {/* Invoice Date */}
              <div>
                <label style={{
                  display: 'inline-block',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '0.25rem',
                  borderBottom: '2px dashed #D1D5DB',
                  paddingBottom: '0.125rem',
                }}>
                  {data.documentTitle} Date<span style={{ color: '#EF4444' }}>*</span>
                </label>
                <div style={{ position: 'relative', marginTop: '0.25rem' }} className="calendar-container">
                  <input
                    ref={dateInputRefs.issueDate}
                    type="text"
                    value={formatDateForDisplay(data.issueDate)}
                    onClick={() => handleDateInputClick('issueDate')}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '0.5rem 0',
                      paddingRight: '2rem',
                      border: 'none',
                      borderBottom: '1px solid #E5E7EB',
                      background: 'transparent',
                      fontSize: '0.9375rem',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  />
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9CA3AF',
                      pointerEvents: 'none',
                    }}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {openCalendar === 'issueDate' && (
                    <CustomCalendar fieldName="issueDate" currentDate={data.issueDate} />
                  )}
                </div>
              </div>

              {/* Due Date - Toggleable Section */}
              {showDueDate ? (
                <div>
                  <label style={{
                    display: 'inline-block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.25rem',
                    borderBottom: '2px dashed #D1D5DB',
                    paddingBottom: '0.125rem',
                  }}>
                    Due Date
                  </label>
                  <div style={{ position: 'relative', marginTop: '0.25rem' }} className="calendar-container">
                    <input
                      ref={dateInputRefs.validTillDate}
                      type="text"
                      value={data.validTillDate ? formatDateForDisplay(data.validTillDate) : ''}
                      onClick={() => handleDateInputClick('validTillDate')}
                      readOnly
                      style={{
                        width: '100%',
                        padding: '0.5rem 0',
                        paddingRight: '2.5rem',
                        border: 'none',
                        borderBottom: '1px solid #E5E7EB',
                        background: 'transparent',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                      placeholder="Select date"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDueDate(false);
                      }}
                      style={{
                        position: 'absolute',
                        right: '1.5rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: 0,
                        width: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ×
                    </button>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9CA3AF',
                        pointerEvents: 'none',
                      }}
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {openCalendar === 'validTillDate' && (
                      <CustomCalendar fieldName="validTillDate" currentDate={data.validTillDate || ''} minDate={data.issueDate} />
                    )}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDueDate(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8B5CF6',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    marginTop: '0.25rem',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add due date
                </button>
              )}

              {/* Custom Fields */}
              {data.customFields && data.customFields.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {data.customFields.map((field) => (
                    <div key={field.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateCustomField(field.id, { label: e.target.value })}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0',
                          border: 'none',
                          borderBottom: '1px solid #E5E7EB',
                          background: 'transparent',
                          fontSize: '0.9375rem',
                          outline: 'none',
                        }}
                        placeholder="Field Label"
                      />
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateCustomField(field.id, { value: e.target.value })}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0',
                          paddingRight: '1.5rem',
                          border: 'none',
                          borderBottom: '1px solid #E5E7EB',
                          background: 'transparent',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          position: 'relative',
                        }}
                        placeholder="Field Value"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomField(field.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#9CA3AF',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: 0,
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Custom Fields Button - Below custom fields */}
              <button
                type="button"
                onClick={openCustomFieldModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8B5CF6',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  alignSelf: 'flex-start',
                  marginTop: '0.25rem',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Custom Fields
              </button>

            </div>
          </div>

          {/* Right: Logo Upload - Centered */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            <div
              style={{
                border: '2px dashed #D1D5DB',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
                minWidth: '180px',
                background: '#F9FAFB',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '150px',
              }}
            >
              {data.business.logo ? (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <img
                      src={data.business.logo}
                      alt="Business Logo"
                      style={{ maxWidth: '100%', maxHeight: '100px', borderRadius: '4px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        onUpdate({
                          business: { ...data.business, logo: undefined },
                        });
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B5CF6',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B5CF6',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      change
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: '#8B5CF6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.5rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Add Business Logo
                  </button>
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    Resolution up to 1080x1080px.
                    <br />
                    PNG or JPEG file.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>


        {/* Business Details Section - Quotation From & For */}
        <div style={{ marginTop: '2rem', paddingBottom: '2rem' }}>
          {/* Two Column Grid for From and For */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1rem' }}>
            {/* Quotation From - Business Details */}
            <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
                  {data.documentTitle} From
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Your Details</p>
              </div>

              {/* Business Name Dropdown */}
              <div style={{ marginBottom: '1rem', position: 'relative' }}>
                <input
                  type="text"
                  value={data.business.name || 'JS GLOBAL'}
                  onChange={(e) => onUpdate({ business: { ...data.business, name: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '2.5rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    background: 'white',
                  }}
                  placeholder="Business Name"
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                    pointerEvents: 'none',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Business Details Display */}
              <div style={{ background: 'white', borderRadius: '8px', padding: '1rem', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Business details</h4>
                  <button
                    type="button"
                    onClick={() => setIsBusinessDetailsModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8B5CF6',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem' }}>
                    <span style={{ color: '#6B7280' }}>Business Name</span>
                    <span style={{ color: '#111827', fontWeight: 500 }}>{data.business.name || 'JS GLOBAL'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem' }}>
                    <span style={{ color: '#6B7280' }}>Address</span>
                    <span style={{ color: '#111827' }}>
                      {data.business.address || 'Shop no. 1, Ar Plaza, Rampur Jagir Market, Beta 1, Greater Noida, Uttar Pradesh, India - 201308'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem' }}>
                    <span style={{ color: '#6B7280' }}>Phone</span>
                    <span style={{ color: '#111827' }}>{data.business.phone || '+91 87449 87942'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quotation For - Client Details */}
            <div style={{ background: '#F9FAFB', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E5E7EB' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '0.25rem' }}>
                  {data.documentTitle} For
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>Client's Details</p>
              </div>

              {/* Client Name Dropdown */}
              <div style={{ marginBottom: '1rem', position: 'relative' }}>
                <input
                  type="text"
                  value={data.client.name || 'Rajat Sir'}
                  onChange={(e) => onUpdate({ client: { ...data.client, name: e.target.value } })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    paddingRight: '2.5rem',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    background: 'white',
                  }}
                  placeholder="Client Name"
                />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                    pointerEvents: 'none',
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Client Details Display */}
              <div style={{ background: 'white', borderRadius: '8px', padding: '1rem', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Business details</h4>
                  <button
                    type="button"
                    onClick={() => setIsClientDetailsModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8B5CF6',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem' }}>
                    <span style={{ color: '#6B7280' }}>Business Name</span>
                    <span style={{ color: '#8B5CF6', fontWeight: 500 }}>{data.client.name || 'Rajat Sir'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '0.5rem' }}>
                    <span style={{ color: '#6B7280' }}>Address</span>
                    <span style={{ color: '#111827' }}>{data.client.address || 'India'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Shipping Details - Outside with checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              style={{
                width: '16px',
                height: '16px',
                cursor: 'pointer',
                accentColor: '#8B5CF6',
              }}
            />
            <span style={{ fontSize: '0.875rem', color: '#6B7280' }}>Add Shipping Details</span>
          </label>
        </div>







        {/* Items Section */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ background: '#8B5CF6', color: 'white', padding: '0.75rem 1rem', borderRadius: '6px 6px 0 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isTaxInvoice ? '2fr 1fr 1fr 1fr 1fr 1fr' : '3fr 1fr 1fr 1fr', gap: '1rem', fontSize: '0.875rem', fontWeight: 600 }}>
              <div>Item</div>
              {isTaxInvoice && <div>HSN/SAC</div>}
              {isTaxInvoice && <div>GST Rate</div>}
              <div>Quantity</div>
              <div>Rate</div>
              <div>Amount</div>
            </div>
          </div>

          <div style={{ border: '1px solid #E5E7EB', borderTop: 'none', borderRadius: '0 0 6px 6px' }}>
            {data.items.map((item, index) => {
              const amount = item.quantity * item.unitPrice;
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '1rem',
                    borderBottom: index < data.items.length - 1 ? '1px solid #E5E7EB' : 'none',
                    background: index % 2 === 0 ? 'white' : '#F9FAFB',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#374151' }}>{index + 1}</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6B7280',
                          cursor: 'pointer',
                          padding: '0.25rem',
                        }}
                        title="Reorder"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 12h18M3 6h18M3 18h18" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#6B7280',
                          cursor: 'pointer',
                          padding: '0.25rem',
                        }}
                        title="Duplicate"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>
                      {data.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            cursor: 'pointer',
                            padding: '0.25rem',
                          }}
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: isTaxInvoice ? '2fr 1fr 1fr 1fr 1fr 1fr' : '3fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      placeholder="Item Name"
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                      }}
                    />
                    {isTaxInvoice && (
                      <input
                        type="text"
                        value={item.hsnSac || ''}
                        onChange={(e) => updateItem(item.id, { hsnSac: e.target.value })}
                        placeholder="HSN/SAC"
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}
                      />
                    )}
                    {isTaxInvoice && (
                      <input
                        type="number"
                        value={item.taxRate}
                        onChange={(e) => updateItem(item.id, { taxRate: parseFloat(e.target.value) || 0 })}
                        placeholder="GST %"
                        style={{
                          padding: '0.5rem',
                          border: '1px solid #D1D5DB',
                          borderRadius: '4px',
                          fontSize: '0.875rem',
                        }}
                      />
                    )}
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                      placeholder="Qty"
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                      }}
                    />
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="Rate"
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #D1D5DB',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                      }}
                    />
                    <div style={{ padding: '0.5rem', fontSize: '0.875rem', color: '#6B7280', display: 'flex', alignItems: 'center' }}>
                      {formatCurrency(amount, data.currency)}
                    </div>
                  </div>

                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B5CF6',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Add Description
                    </button>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B5CF6',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Add Image
                    </button>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8B5CF6',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Add Unit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={addItem}
              style={{
                background: '#8B5CF6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Add New Line
            </button>
            <button
              type="button"
              style={{
                background: 'white',
                color: '#8B5CF6',
                border: '1px solid #8B5CF6',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Add New Group
            </button>
          </div>
        </div>

        {/* Additional Action Buttons */}
        <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => {
              const terms = prompt('Enter Terms & Conditions:', data.terms || '');
              if (terms !== null) onUpdate({ terms });
            }}
            style={{
              background: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            Add Terms & Conditions
          </button>
          <button
            type="button"
            onClick={() => {
              const notes = prompt('Enter Additional Info:', data.notes || '');
              if (notes !== null) onUpdate({ notes });
            }}
            style={{
              background: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            Add Additional Info
          </button>
          <button
            type="button"
            style={{
              background: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            Add Notes
          </button>
          <button
            type="button"
            style={{
              background: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            Add Contact Details
          </button>
          <button
            type="button"
            style={{
              background: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            Add Signature
          </button>
          <button
            type="button"
            style={{
              background: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: '#374151',
            }}
          >
            Add Attachments
          </button>
        </div>

        {/* Currency Selection */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontSize: '0.875rem', color: '#6B7280', fontWeight: 600 }}>Currency:</label>
          <select
            value={data.currency}
            onChange={(e) => onUpdate({ currency: e.target.value })}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '0.875rem',
              background: 'white',
              cursor: 'pointer',
            }}
          >
            <option value="USD">US Dollar (USD, $)</option>
            <option value="INR">Indian Rupee (INR, ₹)</option>
            <option value="EUR">Euro (EUR, €)</option>
            <option value="GBP">British Pound (GBP, £)</option>
            <option value="JPY">Japanese Yen (JPY, ¥)</option>
          </select>
          {isTaxInvoice && (
            <button
              type="button"
              style={{
                background: 'white',
                border: '1px solid #D1D5DB',
                borderRadius: '6px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                cursor: 'pointer',
                color: '#374151',
              }}
            >
              Configure GST
            </button>
          )}
        </div>

        {/* Totals Section */}
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#F9FAFB', borderRadius: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>Amount</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
                {formatCurrency(totals.subtotal, data.currency)}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8B5CF6',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Add Discounts
              </button>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#8B5CF6',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Add Additional Charges
              </button>
            </div>
          </div>

          {isTaxInvoice && totals.totalTax > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>SGST</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                {formatCurrency(totals.totalTax / 2, data.currency)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: `2px solid ${selectedTemplate.colors.primary}` }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', marginBottom: '0.5rem' }}>
                Total ({data.currency})
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                Total in words: {amountToWords(totals.total, data.currency)}
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: selectedTemplate.colors.primary }}>
              {formatCurrency(totals.total, data.currency)}
            </div>
          </div>
        </div>

        {/* Notes & Terms Display */}
        {(data.notes || data.terms) && (
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#F9FAFB', borderRadius: '6px' }}>
            {data.notes && (
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Notes:</div>
                <div style={{ color: '#6B7280', fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>{data.notes}</div>
              </div>
            )}
            {data.terms && (
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>Terms & Conditions:</div>
                <div style={{ color: '#6B7280', fontSize: '0.9375rem', whiteSpace: 'pre-wrap' }}>{data.terms}</div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="print-hide" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              padding: '0.75rem 2rem',
              background: '#8B5CF6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9375rem',
            }}
          >
            Print
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            style={{
              padding: '0.75rem 2rem',
              background: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9375rem',
            }}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Custom Field Modal */}
      {isCustomFieldModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={closeCustomFieldModal}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              minWidth: '400px',
              maxWidth: '500px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>Add Custom Field</h2>
              <button
                type="button"
                onClick={closeCustomFieldModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: 0,
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ×
              </button>
            </div>

            {/* Label Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Label<span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={customFieldLabel}
                onChange={(e) => setCustomFieldLabel(e.target.value)}
                placeholder="Enter field label"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveCustomField();
                  }
                }}
              />
            </div>

            {/* Value Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Value
              </label>
              <input
                type="text"
                value={customFieldValue}
                onChange={(e) => setCustomFieldValue(e.target.value)}
                placeholder="Enter field value"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '0.9375rem',
                  outline: 'none',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveCustomField();
                  }
                }}
              />
            </div>

            {/* Checkbox */}
            <div style={{ marginBottom: '2rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: '#374151',
                }}
              >
                <input
                  type="checkbox"
                  checked={customFieldDefault}
                  onChange={(e) => setCustomFieldDefault(e.target.checked)}
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                  }}
                />
                <span>Set as default value</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={closeCustomFieldModal}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'white',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveCustomField}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#8B5CF6',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-preview,
          #invoice-preview * {
            visibility: visible;
          }
          #invoice-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none;
            padding: 2rem;
          }
          .print-hide {
            display: none !important;
          }
          input,
          textarea,
          button {
            border: none !important;
            background: transparent !important;
            box-shadow: none !important;
          }
          input:focus,
          textarea:focus {
            outline: none !important;
          }
        }
      `}</style>

      {/* Business Details Modal */}
      {isBusinessDetailsModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={() => setIsBusinessDetailsModalOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Business details</h2>
                <button
                  type="button"
                  onClick={() => setIsBusinessDetailsModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    color: '#6B7280',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {/* Basic Information Section */}
              <div style={{ marginBottom: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setExpandedBusinessSections(prev => ({ ...prev, basicInfo: !prev.basicInfo }))}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'white',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  Basic Information
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: expandedBusinessSections.basicInfo ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {expandedBusinessSections.basicInfo && (
                  <div style={{ padding: '1rem', borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Vendor's Business Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                          Vendor's Business Name<span style={{ color: '#EF4444' }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={data.business.name}
                          onChange={(e) => onUpdate({ business: { ...data.business, name: e.target.value } })}
                          placeholder="JS GLOBAL"
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            background: 'white',
                          }}
                        />
                      </div>

                      {/* Select Country and City/Town - Two columns */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Select Country */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                            Select Country<span style={{ color: '#EF4444' }}>*</span>
                          </label>
                          <select
                            value={data.business.country || ''}
                            onChange={(e) => onUpdate({ business: { ...data.business, country: e.target.value } })}
                            style={{
                              width: '100%',
                              padding: '0.625rem',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                            }}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                          </select>
                        </div>

                        {/* City/Town */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                            City/Town
                          </label>
                          <input
                            type="text"
                            value={data.business.city || ''}
                            onChange={(e) => onUpdate({ business: { ...data.business, city: e.target.value } })}
                            placeholder="Greater Noida"
                            style={{
                              width: '100%',
                              padding: '0.625rem',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tax Information Section */}
              <div style={{ marginBottom: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setExpandedBusinessSections(prev => ({ ...prev, taxInfo: !prev.taxInfo }))}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'white',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  <span>
                    Tax Information <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: expandedBusinessSections.taxInfo ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {expandedBusinessSections.taxInfo && (
                  <div style={{ padding: '1rem', borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Business GSTIN and PAN - Two columns */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Business GSTIN */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                            Business GSTIN
                          </label>
                          <input
                            type="text"
                            placeholder="Business GSTIN (Optional)"
                            style={{
                              width: '100%',
                              padding: '0.625rem',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                            }}
                          />
                        </div>

                        {/* Business PAN Number */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                            Business PAN Number
                          </label>
                          <input
                            type="text"
                            placeholder="Business PAN Number (Optional)"
                            style={{
                              width: '100%',
                              padding: '0.625rem',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                            }}
                          />
                        </div>
                      </div>

                      {/* Check GST Type */}
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#8B5CF6', cursor: 'pointer' }}>
                          Check GST Type ⓘ
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Address Section */}
              <div style={{ marginBottom: '1rem', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setExpandedBusinessSections(prev => ({ ...prev, address: !prev.address }))}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'white',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  <span>
                    Address <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: expandedBusinessSections.address ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {expandedBusinessSections.address && (
                  <div style={{ padding: '1rem', borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Select Country and State/Province - Two columns */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Select Country */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                            Select Country
                          </label>
                          <select
                            style={{
                              width: '100%',
                              padding: '0.625rem',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                            }}
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                          </select>
                        </div>

                        {/* State/Province */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                            State / Province
                          </label>
                          <select
                            style={{
                              width: '100%',
                              padding: '0.625rem',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                            }}
                          >
                            <option value="">Select State / Province</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                          </select>
                        </div>
                      </div>

                      {/* City/Town and Postal Code - Two columns */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* City/Town */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                            City/Town
                          </label>
                          <input
                            type="text"
                            value={data.business.city || ''}
                            onChange={(e) => onUpdate({ business: { ...data.business, city: e.target.value } })}
                            placeholder="Greater Noida"
                            style={{
                              width: '100%',
                              padding: '0.625rem',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                            }}
                          />
                        </div>

                        {/* Postal Code */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                            Postal Code / Zip Code
                          </label>
                          <input
                            type="text"
                            placeholder="201308"
                            style={{
                              width: '100%',
                              padding: '0.625rem',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                            }}
                          />
                        </div>
                      </div>

                      {/* Street Address */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={data.business.address || ''}
                          onChange={(e) => onUpdate({ business: { ...data.business, address: e.target.value } })}
                          placeholder="Shop no. 1, Ar Plaza,  Rampur Jagir Market, Beta 1, Greater Noida"
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            background: 'white',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Details Section */}
              <div style={{ marginBottom: '1.5rem', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={() => setExpandedBusinessSections(prev => ({ ...prev, additionalDetails: !prev.additionalDetails }))}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'white',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  <span>
                    Additional Details <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{
                      transform: expandedBusinessSections.additionalDetails ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {expandedBusinessSections.additionalDetails && (
                  <div style={{ padding: '1rem', borderTop: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Display Name */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                          Display Name
                        </label>
                        <input
                          type="text"
                          placeholder="Display Name"
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            background: 'white',
                          }}
                        />
                      </div>

                      {/* Email and Phone Number - Two columns */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Email */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                            Email
                          </label>
                          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 0.5rem 0' }}>Add to directly email documents from Refrens</p>
                          <input
                            type="email"
                            placeholder="Email"
                            style={{
                              width: '100%',
                              padding: '0.625rem',
                              border: '1px solid #E5E7EB',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                            }}
                          />
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ accentColor: '#8B5CF6' }} />
                            <span style={{ fontSize: '0.875rem', color: '#374151' }}>Show Email in Invoice</span>
                          </label>
                        </div>

                        {/* Phone No. */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.25rem' }}>
                            Phone No.
                          </label>
                          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', margin: '0 0 0.5rem 0' }}>Add to directly WhatsApp documents from Refrens</p>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select style={{ padding: '0.625rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', background: 'white' }}>
                              <option>🇮🇳 +91</option>
                            </select>
                            <input
                              type="tel"
                              value={data.business.phone || ''}
                              onChange={(e) => onUpdate({ business: { ...data.business, phone: e.target.value } })}
                              placeholder="+91 87449-87942"
                              style={{
                                flex: 1,
                                padding: '0.625rem',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                background: 'white',
                              }}
                            />
                          </div>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                            <input type="checkbox" defaultChecked style={{ accentColor: '#8B5CF6' }} />
                            <span style={{ fontSize: '0.875rem', color: '#374151' }}>Show Phone in Invoice</span>
                          </label>
                        </div>
                      </div>

                      {/* Custom Label Field */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <label style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>THIS IS LABLE</label>
                          <button type="button" style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', fontSize: '18px' }}>×</button>
                        </div>
                        <input
                          type="text"
                          placeholder="Value"
                          style={{
                            width: '100%',
                            padding: '0.625rem',
                            border: '1px solid #E5E7EB',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            background: 'white',
                          }}
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', cursor: 'pointer' }}>
                          <input type="checkbox" defaultChecked style={{ accentColor: '#8B5CF6' }} />
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>Show in Invoice Billed By</span>
                        </label>
                      </div>

                      {/* Add Custom Fields Button */}
                      <button
                        type="button"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8B5CF6',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: 0,
                        }}
                      >
                        <span style={{ fontSize: '18px' }}>+</span> Add Custom Fields
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Update Preferences */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={updatePreference === 'all'}
                    onChange={() => setUpdatePreference(updatePreference === 'all' ? 'future' : 'all')}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#8B5CF6',
                    }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Update changes for Previous and Future documents.</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={updatePreference === 'future'}
                    onChange={() => setUpdatePreference('future')}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer',
                      accentColor: '#8B5CF6',
                    }}
                  />
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>Only update for Future documents</span>
                </label>
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => {
                  // Save logic here
                  setIsBusinessDetailsModalOpen(false);
                }}
                style={{
                  width: 'auto',
                  padding: '0.75rem 2rem',
                  background: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Details Modal - Similar structure */}
      {isClientDetailsModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={() => setIsClientDetailsModalOpen(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>Client details</h2>
                <button
                  type="button"
                  onClick={() => setIsClientDetailsModalOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    color: '#6B7280',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body - Client Details Form */}
            <div style={{ padding: '1.5rem' }}>
              {/* Note: Using similar collapsible structure as Business Details */}
              <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '1rem' }}>Client details form - Basic structure created. Full implementation similar to Business Details modal.</p>

              {/* Save Button */}
              <button
                type="button"
                onClick={() => setIsClientDetailsModalOpen(false)}
                style={{
                  marginTop: '2rem',
                  width: 'auto',
                  padding: '0.75rem 2rem',
                  background: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
