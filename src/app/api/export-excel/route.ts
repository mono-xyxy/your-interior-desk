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
        'Submission ID': s.id,
        'Timestamp': s.timestamp,
        'Full Name': s.fullName,
        'Email Address': s.email,
        'Phone / WhatsApp': s.phone,
        'Working Location in India': s.location,
        'Working Budget Fee (₹)': s.budget,
        'Social Handles / Links': s.socialHandles || '',
        'Professional Description & Overview': s.description
      }));

    const wsDesigners = XLSX.utils.json_to_sheet(designersData);
    XLSX.utils.book_append_sheet(wb, wsDesigners, 'Designers');

    // Clients Sheet
    const clientsData = submissions
      .filter(s => s.role === 'client')
      .map(s => ({
        'Submission ID': s.id,
        'Timestamp': s.timestamp,
        'Full Name': s.fullName,
        'Email Address': s.email,
        'Phone / WhatsApp': s.phone,
        'Property Location in India': s.location,
        'Offered Budget (₹)': s.budget,
        'Detailed Scope of Work & Requirements': s.description
      }));

    const wsClients = XLSX.utils.json_to_sheet(clientsData);
    XLSX.utils.book_append_sheet(wb, wsClients, 'Clients');

    // Master Sheet
    const masterData = submissions.map(s => ({
      'ID': s.id,
      'Timestamp': s.timestamp,
      'Role': s.role.toUpperCase(),
      'Name': s.fullName,
      'Email': s.email,
      'Phone': s.phone,
      'Location': s.location,
      'Budget (₹)': s.budget,
      'Social Handles': s.socialHandles || '',
      'Description': s.description
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
