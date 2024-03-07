"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatUnits } from "@ethersproject/units";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button, Input, message, Space, Table, Breadcrumb } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { graphqlClient as client } from "@/app/utils";
import { TOKENS_QUERY } from "@/app/utils/graphqlQueries";

dayjs.extend(relativeTime);

const tokenColumns = [
  {
    title: "Address",
    key: "address",
    ellipsis: true,
    width: "5%",
    render: ({ id }) => <Link href={`/tokens/${id}`}>{id}</Link>
  },
  {
    title: "Name",
    key: "name",
    width: "4%",
    sorter: (a, b) => a?.name?.localeCompare(b?.name),
    render: ({ name }) => <span>{name || "-"}</span>
  },
  {
    title: "Symbol",
    key: "symbol",
    width: "4%",
    sorter: (a, b) => a?.symbol?.localeCompare(b?.symbol),
    render: ({ symbol }) => <span>{symbol || "-"}</span>
  },
  {
    title: "Decimals",
    key: "decimals",
    dataIndex: "decimals",
    width: "4%",
    sorter: (a, b) => a.decimals - b.decimals
  },
  {
    title: "TotalSupply",
    width: "4%",
    sorter: (a, b) => a.totalSupply - b.totalSupply,
    render: ({ totalSupply, decimals, symbol }) =>
      `${formatUnits(totalSupply, decimals).replace(
        /(\.\d{3}).*/,
        "$1"
      )} ${symbol}`
  }
];

export default function Tokens() {
  const [dataLoading, setDataLoading] = useState(false);
  const [tokens, setTokens] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  const getTokens = async () => {
    setDataLoading(true);
    client
      .request(TOKENS_QUERY, {
        skip: 0,
        first: 100,
        orderBy: "totalSupply",
        orderDirection: "desc",
        where: {
          ...(searchQuery && {
            or: [
              { address_contains_nocase: searchQuery },
              { name_contains_nocase: searchQuery },
              { symbol_contains_nocase: searchQuery }
            ]
          })
        }
      })
      .then((data) => {
        setTokens(data.tokens);
        setDataLoading(false);
      })
      .catch((err) => {
        message.error("Something went wrong!");
        console.error("failed to get tokens: ", err);
        setDataLoading(false);
      });
  };

  useEffect(() => {
    getTokens();
  }, []);

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Tokens</h3>
      <Breadcrumb
        items={[
          {
            title: <Link href="/">Home</Link>
          },
          {
            title: <Link href="/tokens">Tokens</Link>
          }
        ]}
      />
      <Space>
        <Input.Search
          placeholder="Search by name, symbol or address"
          value={searchQuery}
          enterButton
          allowClear
          onSearch={getTokens}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              router.replace("/tokens");
            } else {
              router.replace(`?q=${encodeURIComponent(e.target.value)}`, {
                scroll: false
              });
            }
          }}
        />
        <Button type="primary" onClick={getTokens}>
          <SyncOutlined spin={dataLoading} />
        </Button>
      </Space>
      <Table
        className="table_grid"
        columns={tokenColumns}
        rowKey="id"
        dataSource={tokens}
        scroll={{ x: 970 }}
        loading={dataLoading}
        pagination={{
          pageSizeOptions: [10, 25, 50, 100],
          showSizeChanger: true,
          defaultCurrent: 1,
          defaultPageSize: 10,
          size: "small"
        }}
        onChange={() => {}}
      />
    </div>
  );
}
