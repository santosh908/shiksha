// DateInputConmponent.jsx
import { DateInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

interface DateInputConmponentProps {
    value: string; // Date string in dd/mm/yyyy format
    onChange: (date: string) => void; // Callback function for date change
    [key: string]: any; // For any additional props
}

const formatDate = (date: Date | null) => {
    if (!date) return '';
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const parseDate = (dateStr: string) => {
    if (typeof dateStr !== 'string' || !dateStr) return null;
    const [day, month, year] = dateStr.split('/').map(part => parseInt(part, 10));
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month - 1, day); // Months are zero-based
};

const DateInputConmponent: React.FC<DateInputConmponentProps> = ({ value, onChange, ...props }) => {
    const [internalValue, setInternalValue] = useState<Date | null>(parseDate(value));

    useEffect(() => {
        setInternalValue(parseDate(value));
    }, [value]);

    const handleDateChange = (date: Date | null) => {
        const formattedDate = date ? formatDate(date) : '';
        setInternalValue(date);
        onChange(formattedDate);
    };

    return (
        <DateInput
            size="sm"
            className="w-full"
            withAsterisk
            leftSection={<IconCalendar />}
            placeholder="Since when you are joind to ISKCON Dwarka"
            label={
                <>
                    Since when you are joind to ISKCON Dwarka
                    <br /> आप ISKCON द्वारका से कब से जुड़े हुए हैं
                </>
            }
            value={internalValue}
            onChange={handleDateChange}
            clearable
            {...props}
        />
    );
};

export default DateInputConmponent;
