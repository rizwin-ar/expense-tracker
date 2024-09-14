import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message, Menu, Dropdown } from 'antd';
import { generateAIReport } from './ai-report';
import { Entry } from './AddEntryForm';
import dayjs from 'dayjs';

interface ExpenseTableProps {
  entries: Entry[];
}

const ExpenseTable: React.FC<ExpenseTableProps> = ({ entries }) => {
  const [aiReport, setAIReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState<Entry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'day' | 'week' | 'month'>('month'); // Default filter

  useEffect(() => {
    handleFilter(selectedFilter);
  }, [selectedFilter, entries]);

  const handleGenerateReport = async () => {
    if (entries.length === 0) {
      message.error('No entries available for analysis.');
      return;
    }
    setLoading(true);
    try {
      const report = await generateAIReport(entries);
      setAIReport(report);
    } catch (error) {
      message.error('Failed to generate the report.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filterType: 'day' | 'week' | 'month') => {
    const now = dayjs();
    const startOfPeriod = filterType === 'day' ? now.startOf('day') :
      filterType === 'week' ? now.startOf('week') :
        now.startOf('month');
    const endOfPeriod = filterType === 'day' ? now.endOf('day') :
      filterType === 'week' ? now.endOf('week') :
        now.endOf('month');

    const filtered = entries.filter(entry => {
      const entryDate = dayjs(entry.date);
      return entryDate.isAfter(startOfPeriod.subtract(1, 'day')) &&
        entryDate.isBefore(endOfPeriod.add(1, 'day'));
    });

    setFilteredEntries(filtered);
    setSelectedFilter(filterType);
  };

  const columns = [
    { title: 'Category', dataIndex: 'category', key: 'category' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number, record: Entry) => (
        <span style={{ color: record.type === 'expense' ? 'red' : 'green' }}>
          ${text.toFixed(2)}
        </span>
      ),
    },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Date', dataIndex: 'date', key: 'date', render: (text: any) => text.format('YYYY-MM-DD') },
  ];

  const menu = (
    <Menu selectedKeys={[selectedFilter]}>
      <Menu.Item key="day" onClick={() => handleFilter('day')}>Today</Menu.Item>
      <Menu.Item key="week" onClick={() => handleFilter('week')}>This Week</Menu.Item>
      <Menu.Item key="month" onClick={() => handleFilter('month')}>This Month</Menu.Item>
    </Menu>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', marginBottom: '20px' }}>
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="default">Filter by {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</Button>
        </Dropdown>
        <Button onClick={handleGenerateReport} type="primary" loading={loading}>
          Generate AI Report
        </Button>
      </div>

      {aiReport && (
        <Modal
          title="AI-Powered Expense Report"
          visible={!!aiReport}
          onCancel={() => setAIReport(null)}
          footer={null}
        >
          <p>{aiReport}</p>
        </Modal>
      )}

      <div style={{ width: "100%" }}>
        <Table
          dataSource={filteredEntries}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default ExpenseTable;
