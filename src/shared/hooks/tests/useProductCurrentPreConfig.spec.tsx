import React from "react";
import { useProductCurrentPreConfig } from "@hooks/useProductCurrentPreConfig";
import { renderHook } from "@testing-library/react";
import { OrganizationProvider } from "@contexts/OrganizationProvider";
import { ProductProvider } from "@contexts/ProductProvider";
import { RepositoryProvider } from "@contexts/RepositoryProvider";
import ProductConfigFilterProvider from "@contexts/ProductConfigFilterProvider/ProductConfigFilterProvider";
import useSWR from "swr";

jest.mock("swr")

interface Props {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: Props) => (
  <OrganizationProvider>
    <ProductProvider>
      <RepositoryProvider>
        <ProductConfigFilterProvider>
          {children}
        </ProductConfigFilterProvider>
      </RepositoryProvider>
    </ProductProvider>
  </OrganizationProvider>
)

const data = [
  {
    "key": "reliability",
    "weight": 100,
    "subcharacteristics": [
      {
        "key": "testing_status",
        "weight": 100,
        "measures": [
          {
            "key": "passed_tests",
            "weight": 33,
            "metrics": [
              {
                "key": "tests"
              },
              {
                "key": "test_failures"
              },
              {
                "key": "test_errors"
              }
            ]
          },
          {
            "key": "test_builds",
            "weight": 20,
            "metrics": [
              {
                "key": "test_execution_time"
              },
              {
                "key": "tests"
              }
            ],
            "max_threshold": 300000
          },
          {
            "key": "test_coverage",
            "weight": 47,
            "metrics": [
              {
                "key": "coverage"
              }
            ],
            "min_threshold": 70
          }
        ]
      }
    ]
  }
];

describe("useProductCurrentPreConfig", () => {
  it("should return the current pre config", () => {
    useSWR.mockReturnValue({
      data,
      error: null,
      isValidating: false,
    });

    const { result } = renderHook(() => useProductCurrentPreConfig(), {
      wrapper: AllTheProviders,
    });

    expect(result).toMatchSnapshot();
  });
})
