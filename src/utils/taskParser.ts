
import { ParsedTask } from '../types/Task';

export function parseNaturalLanguageTask(input: string): ParsedTask {
  let name = input.trim();
  let assignedTo = '';
  let dueDate: Date | null = null;
  let priority: 'P1' | 'P2' | 'P3' | 'P4' = 'P3';

  // Extract priority (P1, P2, P3, P4)
  const priorityMatch = input.match(/\b(P[1-4])\b/i);
  if (priorityMatch) {
    priority = priorityMatch[1].toUpperCase() as 'P1' | 'P2' | 'P3' | 'P4';
    name = name.replace(priorityMatch[0], '').trim();
  }

  // Extract assigned person (by [name] or [name])
  const assigneeMatch = input.match(/\b(?:by|for|assigned to)\s+([A-Za-z\s]+?)(?:\s+(?:by|on|at|P[1-4]|$))/i);
  if (assigneeMatch) {
    assignedTo = assigneeMatch[1].trim();
    name = name.replace(assigneeMatch[0], '').trim();
  }

  // Extract date and time
  const datePatterns = [
    // "11pm 20th June", "2pm June 20th", "June 20 at 2pm"
    /\b(\d{1,2}(?:am|pm))\s+(\d{1,2}(?:st|nd|rd|th)?)\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*)\b/i,
    /\b(\d{1,2}(?:am|pm))\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*)\s+(\d{1,2}(?:st|nd|rd|th)?)\b/i,
    /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*)\s+(\d{1,2}(?:st|nd|rd|th)?)\s+(?:at\s+)?(\d{1,2}(?:am|pm))\b/i,
    // "June 20", "20th June"
    /\b(\d{1,2}(?:st|nd|rd|th)?)\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*)\b/i,
    /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*)\s+(\d{1,2}(?:st|nd|rd|th)?)\b/i,
    // "today", "tomorrow"
    /\b(today|tomorrow)\b/i,
    // "2024-06-20", "06/20/2024"
    /\b(\d{4})-(\d{1,2})-(\d{1,2})\b/,
    /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/
  ];

  for (const pattern of datePatterns) {
    const match = input.match(pattern);
    if (match) {
      try {
        dueDate = parseDateFromMatch(match);
        if (dueDate) {
          name = name.replace(match[0], '').trim();
          break;
        }
      } catch (e) {
        console.warn('Failed to parse date:', match[0]);
      }
    }
  }

  // Clean up the task name
  name = name.replace(/\s+/g, ' ').trim();
  
  return {
    name: name || 'Untitled Task',
    assignedTo,
    dueDate,
    priority
  };
}

function parseDateFromMatch(match: RegExpMatchArray): Date | null {
  const currentYear = new Date().getFullYear();
  
  if (match[0].toLowerCase() === 'today') {
    return new Date();
  }
  
  if (match[0].toLowerCase() === 'tomorrow') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  // Handle different date formats
  const monthNames: { [key: string]: number } = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11
  };
  
  // Extract components
  let day: number | null = null;
  let month: number | null = null;
  let year: number = currentYear;
  let hour: number | null = null;
  
  for (let i = 1; i < match.length; i++) {
    const part = match[i];
    if (!part) continue;
    
    // Check if it's a month
    const monthKey = part.toLowerCase().replace(/[^a-z]/g, '');
    if (monthNames.hasOwnProperty(monthKey)) {
      month = monthNames[monthKey];
      continue;
    }
    
    // Check if it's a day
    const dayNum = parseInt(part.replace(/[^0-9]/g, ''));
    if (dayNum >= 1 && dayNum <= 31 && day === null) {
      day = dayNum;
      continue;
    }
    
    // Check if it's a time
    if (part.match(/\d{1,2}(am|pm)/i)) {
      const timeMatch = part.match(/(\d{1,2})(am|pm)/i);
      if (timeMatch) {
        hour = parseInt(timeMatch[1]);
        if (timeMatch[2].toLowerCase() === 'pm' && hour !== 12) {
          hour += 12;
        } else if (timeMatch[2].toLowerCase() === 'am' && hour === 12) {
          hour = 0;
        }
      }
      continue;
    }
    
    // Check if it's a year
    const yearNum = parseInt(part);
    if (yearNum >= 2020 && yearNum <= 2030) {
      year = yearNum;
    }
  }
  
  if (day !== null && month !== null) {
    const date = new Date(year, month, day);
    if (hour !== null) {
      date.setHours(hour, 0, 0, 0);
    }
    return date;
  }
  
  return null;
}
