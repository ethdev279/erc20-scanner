"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatUnits } from "@ethersproject/units";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button, Input, message, Space, Table, Breadcrumb } from "antd";
import { SyncOutlined, ExportOutlined, EnterOutlined } from "@ant-design/icons";
import { graphqlClient as client } from "./utils";
import { explorerUrl } from "./utils/config";
import { TOKEN_TRANSFERS_QUERY } from "./utils/graphqlQueries";

dayjs.extend(relativeTime);

const tokenTransferColumns = [
  {
    title: "Transaction ID",
    key: "txHash",
    ellipsis: true,
    width: "5%",
    render: ({ txHash }) => (
      <Space>
        {txHash.slice(0, 15) + "..." + txHash.slice(-5)}
        <a
          href={`${explorerUrl}/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <ExportOutlined
            title="View on Explorer"
            style={{ fontSize: "1rem" }}
          />
        </a>
      </Space>
    )
  },
  {
    title: "Age",
    key: "timestamp",
    width: "4%",
    sorter: (a, b) => a.timestamp - b.timestamp,
    render: ({ timestamp }) => dayjs(timestamp * 1000).fromNow(true)
  },
  {
    title: "From",
    key: "from",
    ellipsis: true,
    width: "8%",
    sorter: (a, b) => a?.from?.address?.localeCompare(b?.from?.address),
    render: ({ from }) => (
      <Link href={`/address/${from.address}`}>{from.address}</Link>
    )
  },
  {
    title: "To",
    key: "to",
    ellipsis: true,
    width: "8%",
    sorter: (a, b) => a?.to?.address?.localeCompare(b?.to?.address),
    render: ({ to }) => (
      <Link href={`/address/${to.address}`}>{to.address}</Link>
    )
  },
  {
    title: "Value",
    key: "value",
    width: "4%",
    sorter: (a, b) => a.value - b.value,
    render: ({ value, token }) =>
      `${formatUnits(value, token?.decimals).replace(/(\.\d{3}).*/, "$1")} ${
        token?.symbol
      }`
  },
  {
    title: "Token",
    key: "token",
    width: "4%",
    sorter: (a, b) => a?.token?.name?.localeCompare(b?.token?.name),
    render: ({ token }) => (
      <Link href={`/tokens/${token?.address}`}>{token?.name}</Link>
    )
  }
];

export default function Home() {
  const [dataLoading, setDataLoading] = useState(false);
  const [tokenTransfers, setTokenTransfers] = useState([]);

  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");

  const getTokenTransfers = async () => {
    setDataLoading(true);
    client
      .request(TOKEN_TRANSFERS_QUERY, {
        skip: 0,
        first: 100,
        orderBy: "timestamp",
        orderDirection: "desc",
        where: {
          ...(searchQuery && {
            or: [
              { from_contains_nocase: searchQuery },
              { to_contains_nocase: searchQuery },
              { token_contains_nocase: searchQuery },
              { txHash_contains_nocase: searchQuery },
              {
                token_: {
                  name_contains_nocase: searchQuery,
                  symbol_contains_nocase: searchQuery
                }
              }
            ]
          })
        }
      })
      .then((data) => {
        setTokenTransfers(data.transfers);
        setDataLoading(false);
      })
      .catch((err) => {
        message.error("Something went wrong!");
        console.error("failed to get transfers: ", err);
        setDataLoading(false);
      });
  };

  useEffect(() => {
    getTokenTransfers();
  }, []);

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Recent Transfers</h3>
      <Breadcrumb
        items={[
          {
            title: (
              <Link href="/tokens">
                Jump to Tokens
                <EnterOutlined />
              </Link>
            )
          }
        ]}
      />
      <Space>
        <Input.Search
          placeholder="Search by address, token or transaction hash"
          value={searchQuery}
          enterButton
          allowClear
          onSearch={getTokenTransfers}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "") {
              router.replace("/");
            } else {
              router.replace(`?q=${encodeURIComponent(e.target.value)}`, {
                scroll: false
              });
            }
          }}
        />
        <Button type="primary" onClick={getTokenTransfers}>
          <SyncOutlined spin={dataLoading} />
        </Button>
      </Space>
      <Table
        className="table_grid"
        columns={tokenTransferColumns}
        rowKey="id"
        dataSource={tokenTransfers}
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
