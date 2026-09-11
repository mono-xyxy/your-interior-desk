import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/excel';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    const submissions = getSubmissions();
    
    const wb = XLSX.utils.book_new();

    // Designers Sheet
    const designersData = submissions
      .filter(s => s.role === 'designer')
      .map(s => ({
        'ID': s.id,
        'Timestamp': s.timestamp,
        'Full Name': s.fullName,
        'Email': s.email,
        'Phone / WhatsApp': s.phone,
        'City / Location in India': s.location,
        'Min Working Budget (₹)': s.budget,
        'Experience Level': s.experience || '',
        'Specializations': s.specializations || '',
        'Portfolio / Instagram Link': s.portfolioLink || '',
        'Additional Notes': s.additionalNotes || ''
      }));

    const wsDesigners = XLSX.utils.json_to_sheet(designersData);
    XLSX.utils.book_append_sheet(wb, wsDesigners, 'Designers');

    // Clients Sheet
    const clientsData = submissions
      .filter(s => s.role === 'client')
      .map(s => ({
        'ID': s.id,
        'Timestamp': s.timestamp,
        'Full Name': s.fullName,
        'Email': s.email,
        'Phone / WhatsApp': s.phone,
        'Property Location in India': s.location,
        'Offered Budget (₹)': s.budget,
        'Property Type': s.propertyType || '',
        'Scope of Work': s.scopeOfWork || '',
        'Preferred Design Style': s.preferredStyle || '',
        'Desired Timeline': s.timeline || ''
      }));

    const wsClients = XLSX.utils.json_to_sheet(clientsData);
    XLSX.utils.book_append_sheet(wb, wsClients, 'Clients');

    // Master Sheet
    const masterData = submissions.map(s => ({
      'ID': s.id,
      'Timestamp': s.timestamp,
      'Role Type': s.role.toUpperCase(),
      'Name': s.fullName,
      'Email': s.email,
      'Phone': s.phone,
      'Location': s.location,
      'Budget (₹)': s.budget,
      'Details Summary': s.role === 'designer' 
        ? `${s.experience || ''} | ${s.specializations || ''}`
        : `${s.propertyType || ''} | ${s.scopeOfWork || ''} | ${s.preferredStyle || ''}`
    }));

    const wsMaster = XLSX.utils.json_to_sheet(masterData);
    XLSX.utils.book_append_sheet(wb, wsMaster, 'All_Submissions');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Client_Designer.xlsx"',
      },
    });
  } catch (error) {
    console.error('Export Excel error:', error);
    return NextResponse.json({ error: 'Failed to generate Excel download' }, { status: 500 });
  }
}
