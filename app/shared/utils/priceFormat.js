/**
 * Formats a number into Indian Rupee price format
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns {string} Formatted price string
 * 
 * Examples:
 * formatIndianPrice(1234567.89) => "₹12,34,567.89"
 * formatIndianPrice(1234567.89, false) => "12,34,567.89"
 * formatIndianPrice(1234) => "₹1,234.00"
 */
export const formatIndianPrice = (amount, showSymbol = true) => {
  try {
    // Convert to number if string is passed
    const number = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Check if it's a valid number
    if (isNaN(number)) {
      return showSymbol ? '₹0.00' : '0.00';
    }

    // Format the number with Indian locale and currency
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    const formattedNumber = formatter.format(number);
    return showSymbol ? `₹${formattedNumber}` : formattedNumber;
  } catch (error) {
    console.error('Error formatting price:', error);
    return showSymbol ? '₹0.00' : '0.00';
  }
};

/**
 * Formats a number into compact Indian Rupee format (K, L, Cr)
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns {string} Formatted compact price string
 * 
 * Examples:
 * formatCompactIndianPrice(123456) => "₹1.23L"
 * formatCompactIndianPrice(12345678) => "₹1.23Cr"
 * formatCompactIndianPrice(1234) => "₹1.23K"
 */
export const formatCompactIndianPrice = (amount, showSymbol = true) => {
  try {
    const number = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(number)) {
      return showSymbol ? '₹0' : '0';
    }

    const absNumber = Math.abs(number);
    let result;

    if (absNumber >= 10000000) {
      result = `${(number / 10000000).toFixed(2)}Cr`;
    } else if (absNumber >= 100000) {
      result = `${(number / 100000).toFixed(2)}L`;
    } else if (absNumber >= 1000) {
      result = `${(number / 1000).toFixed(2)}K`;
    } else {
      result = number.toString();
    }

    return showSymbol ? `₹${result}` : result;
  } catch (error) {
    console.error('Error formatting compact price:', error);
    return showSymbol ? '₹0' : '0';
  }
}; 